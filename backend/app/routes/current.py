from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .locationapi import getweather_api
from bson import ObjectId

router = APIRouter(prefix="/api/v1/current",tags=["current"])



@router.get("/today/{city}")
async def todays_forecast(request : Request, city: str):

    response = await getweather_api(request,city)
    
    result  = await request.app.mongodb["CurrentWeather"].insert_one(response)
    inserted_forecadst = await request.app.mongodb["CurrentWeather"].find_one({"_id": result.inserted_id})
    print("Inserted ID:", result.inserted_id)
    
    inserted_forecadst["_id"] = str(inserted_forecadst["_id"])
    count = await request.app.mongodb["CurrentWeather"].count_documents({})
    print("Documents after insert:", count)
    inserted_forecadst.pop("_id", None)
    return inserted_forecadst        
    
        
   
