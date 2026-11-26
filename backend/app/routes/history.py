from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import getweatherhistory_api
from bson import ObjectId
from datetime import datetime , date , timezone
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter(prefix="/api/v1/history",tags=["history"])

class HistoryCreate(BaseModel):
    location_id: str
    start: date
    end: date

def format_history(doc):
    daily = {}

    for reading in doc["readings"]:
        day = reading["time"][:10]
        temp = reading["temperature"]

        if day not in daily:
            daily[day] = {
                "date": day,
                "min_c": temp,
                "max_c": temp
            }
        else:
            daily[day]["min_c"] = min(daily[day]["min_c"], temp)
            daily[day]["max_c"] = max(daily[day]["max_c"], temp)

    return {
        "_id": str(doc["_id"]),
        
        "location_id": str(doc["location_id"]),
        "name": doc["location"]["name"],
        "country": doc["location"]["country"],
        "start_date": doc["start_date"],
        "end_date": doc["end_date"],
        "days": list(daily.values()),
        "created_at": doc["created_at"]
    }
   
 
@router.post("/insert", status_code=201, response_model=models.TemperatureRecordOut)
async def create_current_weather(payload: HistoryCreate, request: Request):
    try:
        location_oid = ObjectId(payload.location_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid location id")
    if payload.start>payload.end :
        raise HTTPException(status_code=400,detail="start_date must be before end_date")
    if (payload.end-payload.start).days >= 366:
        raise HTTPException(status_code=400,detail="Range cannot exceed 365 days")
    if payload.end>date.today():
        raise HTTPException(status_code=400,detail="only covers past dates")
    
    location = await request.app.mongodb["location"].find_one({"_id": location_oid})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    raw = await getweatherhistory_api(request, location["name"], payload.start, payload.end)

    hourly = raw.get("hourly") or {}

    times = hourly.get("time") or []
    temperatures = hourly.get("temperature_2m") or []

    if not times:
        raise HTTPException(
            status_code=400,
            detail="No historical data available"
        )

    readings = [
        {"time": t, "temperature": temp}
        for t, temp in zip(times, temperatures)
    ]

    doc = {
    "location_id": location_oid,
    "location": {
        "name": location.get("name"),
        "country": location.get("country"),
        "coordinates": {
            "lat": location["coordinates"]["lat"],
            "lon": location["coordinates"]["lon"]
        },
    },
    "start_date": payload.start.isoformat(),
    "end_date": payload.end.isoformat(),
    "readings": readings,
    "created_at": datetime.now(timezone.utc),
    }    


    result = await request.app.mongodb["TemperatureRecord"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_history(doc)


@router.get("/display",response_model=list[models.TemperatureRecordOut])
async def list_current_weather(request: Request):
    docs = await request.app.mongodb["TemperatureRecord"].find().to_list(None)
    return [format_history(doc) for doc in docs]


@router.get("/display/{weather_id}",response_model=models.TemperatureRecordOut)
async def get_current_weather(weather_id: str, request: Request):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")

    doc = await request.app.mongodb["TemperatureRecord"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Record not found")

    doc["_id"] = str(doc["_id"])
    doc["location_id"] = str(doc["location_id"])
    return format_history(doc) 

@router.delete("/delete/{weather_id}",response_model=dict)
async def delete_forecast(request: Request, weather_id : str):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")
    
    result =  await request.app.mongodb["TemperatureRecord"].delete_many({"_id":oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}
