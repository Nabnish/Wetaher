from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import  getweather5days_api
from bson import ObjectId

router = APIRouter(prefix="/api/v1/5day",tags=["5day"])



@router.get("/display/{city}",response_model=models.FiveDayForecast)
async def todays_forecast(request : Request, city: str):

    response = await getweather5days_api(request,city)
    forecast = models.FiveDayForecast(**response)
    result  = await request.app.mongodb["FiveDayForecast"].insert_one(forecast.model_dump())
    inserted_forecadst = await request.app.mongodb["FiveDayForecast"].find_one({"_id": result.inserted_id})
    print("Inserted ID:", result.inserted_id)
    
    inserted_forecadst["_id"] = str(inserted_forecadst["_id"])
    count = await request.app.mongodb["FiveDayForecast"].count_documents({})
    print("Documents after insert:", count)
    inserted_forecadst.pop("_id", None)
    return inserted_forecadst        

@router.delete("/delete/{city}",response_model=dict)
async def delete_forecast(request: Request, city: str):
    result =  await request.app.mongodb["FiveDayForecast"].delete_many({"city.name":city.title()})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}

@router.get("/display",response_model=list[models.FiveDayForecast])
async def display_all(request : Request):
    result = await request.app.mongodb["FiveDayForecast"].find().to_list(None)
    print(await request.app.mongodb["FiveDayForecast"].count_documents({}))
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result
   
