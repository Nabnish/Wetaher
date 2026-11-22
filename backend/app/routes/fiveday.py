from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import  getweather5days_api
from bson import ObjectId
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime , timezone

router = APIRouter(prefix="/api/v1/5day",tags=["5day"])

class fivedayWeatherCreate(BaseModel):
    location_id: str



@router.post("/insert", status_code=201, response_model=models.FiveDayForecast)
async def create_current_weather(payload: fivedayWeatherCreate, request: Request):
    try:
        location_oid = ObjectId(payload.location_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid location id")

    location = await request.app.mongodb["location"].find_one({"_id": location_oid})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    
    raw = await getweather5days_api(request , location["name"])

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
    "forecast": [
        {
            "observed_at": item["dt"],
            "forecast_at": item["dt_txt"],
            "temperature_c": item["main"]["temp"],
            "feels_like_c": item["main"]["feels_like"],
            "temp_min": item["main"]["temp_min"],
            "temp_max": item["main"]["temp_max"],
            "pressure": item["main"]["pressure"],
            "humidity": item["main"]["humidity"],
            "condition": item["weather"][0]["description"],
            "weather_main": item["weather"][0]["main"],
        
            "cloudiness": item["clouds"]["all"],
            "wind_speed": item["wind"]["speed"],
            "wind_degree": item["wind"]["deg"],
            "probability_of_precipitation": item["pop"],
            "visibility": item["visibility"],
        }
        for item in raw["list"]
    ],
    "created_at": datetime.now(timezone.utc),
}
    result = await request.app.mongodb["FiveDayForecast"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    doc["location_id"] = str(location_oid)
    return doc


@router.get("/display",response_model=list[models.FiveDayForecast])
async def list_current_weather(request: Request):
    docs = await request.app.mongodb["FiveDayForecast"].find().to_list(None)
    for d in docs:
        d["_id"] = str(d["_id"])
        d["location_id"] = str(d["location_id"])
    return docs


@router.get("/display/{weather_id}",response_model=models.FiveDayForecast)
async def get_current_weather(weather_id: str, request: Request):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")

    doc = await request.app.mongodb["FiveDayForecast"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Record not found")

    doc["_id"] = str(doc["_id"])
    doc["location_id"] = str(doc["location_id"])
    return doc   

@router.delete("/delete/{weather_id}",response_model=dict)
async def delete_forecast(request: Request, weather_id : str):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")
    
    result =  await request.app.mongodb["FiveDayForecast"].delete_many({"_id":oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}

