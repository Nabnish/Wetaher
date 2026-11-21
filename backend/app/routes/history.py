from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import getweatherhistory_api
from bson import ObjectId
from datetime import datetime , date

router = APIRouter(prefix="/api/v1/history",tags=["history"])



@router.get("/display/{city}/{start}/{end}",response_model=models.TemperatureRecord)
async def history_forecast(request : Request, city: str, start : date, end: date):
    if start>end :
        raise HTTPException(status_code=400,detail="dates are not valid")
    await request.app.mongodb["TemperatureRequest"].insert_one({"name":city.title(),"start_date":start.isoformat(),"end_date":end.isoformat(),"data_type":"history"})

    response = await getweatherhistory_api(request,city,start,end)
    
    
    temperatures = [
    {
        "time": datetime.fromisoformat(time),
        "temperature": temp
    }
    for time, temp in zip(
        response["hourly"]["time"],
        response["hourly"]["temperature_2m"]
    )
]

    record = {
    "coordinates": {
        "lat": response["latitude"],
        "lon": response["longitude"]
    },
    "start_date": start.isoformat(),
    "end_date": end.isoformat(),
    "temperatures": temperatures,
    "created_at": datetime.now()
}

    result = await request.app.mongodb["TemperatureRecord"].insert_one(record)
    inserted_forecadst = await request.app.mongodb["TemperatureRecord"].find_one({"_id": result.inserted_id})
    
    inserted_forecadst["_id"] = str(inserted_forecadst["_id"])
    count = await request.app.mongodb["TemperatureRecord"].count_documents({})
    inserted_forecadst.pop("_id", None)
    return inserted_forecadst        

@router.delete("/delete/{city}",response_model=dict)
async def delete_forecast(request: Request, city: str):
    result =  await request.app.mongodb["TemperatureRecord"].delete_many({"name":city.title()})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}

@router.get("/display",response_model=list[models.TemperatureRecord])
async def display_all(request : Request):
    result = await request.app.mongodb["TemperatureRecord"].find().to_list(None)
    print(await request.app.mongodb["TemperatureRecord"].count_documents({}))
    if not result:
        raise HTTPException(status_code=404, detail="No records found")
    for item in result:
        item.pop("_id", None)

    return result
    
   
