from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx

router = APIRouter(prefix="/api/v1/current",tags=["current"])



@router.get("/today")
async def todays_forecast(request : Request):
    api_url = "https://api.openweathermap.org/data/2.5/weather"
    location = await request.app.mongodb["location"].find_one({})

    params ={
        "lat": location["coordinates"]["latitude"],
        "lon": location["coordinates"]["longitude"],
        "appid" : os.getenv("WEATHER_API_KEY")
        
    }
  
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                api_url,
                params=params,
                timeout=10.0
            )
            response.raise_for_status() 
            

            return response.json()
            
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"External API error: {exc.response.text}"
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to external API: {str(exc)}"
            )
   
