from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx

router = APIRouter(prefix="/api/v1/locationapi",tags=["locationapi"])

@router.get("/city/{city}")
async def getcords_city(city :str, request : Request):
    api_url = "http://api.openweathermap.org/geo/1.0/direct"
    
    params ={
        "q" : city,
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


@router.get("/zip/{zip_country}")
async def getcords_zip(zip_country: str, request: Request):
    try:
        zip_value, country_code = zip_country.split(",", 1)
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=400,
            detail="ZIP must be provided as /zip/{zip},{country_code}",
        )

    api_url = "http://api.openweathermap.org/geo/1.0/zip"
    
    params ={
        "zip": f"{zip_value},{country_code}",
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


@router.get("/cords/{lat}/{lon}")
async def getcords_zip(lat: float,lon: float, request: Request):
    
    if lat is None or lon is None:
        raise HTTPException(
            status_code=400,
            detail="lat/lon should be a valid float",
        )
    
        

    api_url = "http://api.openweathermap.org/geo/1.0/reverse"

    
    params ={
        "lat": lat,
        "lon": lon,
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


