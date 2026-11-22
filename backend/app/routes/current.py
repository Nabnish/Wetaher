from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import getweather_api
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime , timezone

router = APIRouter(prefix="/api/v1/current",tags=["current"])






class CurrentWeatherCreate(BaseModel):
    location_id: str


@router.post("/today/insert", status_code=201)
async def create_current_weather(payload: CurrentWeatherCreate, request: Request):
    try:
        location_oid = ObjectId(payload.location_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid location id")

    location = await request.app.mongodb["location"].find_one({"_id": location_oid})
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    
    raw = await getweather_api(request , location["name"])

    doc = {
        "location_id": location_oid,
        "location": {
            "name": location.get("name"),
            "country": location.get("country"),
            "coordinates": {"lat": location["coordinates"]["lat"], "lon": location["coordinates"]["lon"]},
        },
        "observed_at": raw.get("dt"),
        "temperature_c": raw["main"]["temp"],
        "feels_like_c": raw["main"]["feels_like"],
        "humidity": raw["main"]["humidity"],
        "condition": raw["weather"][0]["description"],
        "wind_speed": raw["wind"]["speed"],
        "created_at": datetime.now(timezone.utc),
    }

    result = await request.app.mongodb["CurrentWeather"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    doc["location_id"] = str(location_oid)
    return doc


@router.get("/today/display",response_model=list[models.CurrentWeather])
async def list_current_weather(request: Request):
    docs = await request.app.mongodb["CurrentWeather"].find().to_list(None)
    for d in docs:
        d["_id"] = str(d["_id"])
        d["location_id"] = str(d["location_id"])
    return docs


@router.get("/today/display/{weather_id}",response_model=models.CurrentWeather)
async def get_current_weather(weather_id: str, request: Request):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")

    doc = await request.app.mongodb["CurrentWeather"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Record not found")

    doc["_id"] = str(doc["_id"])
    doc["location_id"] = str(doc["location_id"])
    return doc   

@router.delete("/today/delete/{weather_id}",response_model=dict)
async def delete_forecast(request: Request, weather_id: str):
    try:
        oid = ObjectId(weather_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid id")

    result =  await request.app.mongodb["CurrentWeather"].delete_many({"_id":oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}


