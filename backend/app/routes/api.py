from fastapi import HTTPException

import os
import httpx




async def geolocation_api(name="",zip_country="",lat=None,lon=None):

    api_url = "http://api.openweathermap.org/geo/1.0"
   

    if name:
        params = {
                "q" : name,
                "appid": os.getenv("WEATHER_API_KEY")
            }
        api_url+="/direct"
    elif lat is not None and lon is not None:
        params = {
                "lat" : lat,
                "lon" : lon,
                "appid": os.getenv("WEATHER_API_KEY")
            }
        api_url += "/reverse"

    elif zip_country:
        try:
            zip_value, country_code = zip_country.split(",", 1)
            params = {
                    "zip": f"{zip_value},{country_code}",
                    "appid": os.getenv("WEATHER_API_KEY")
                }
            api_url += "/zip"
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="ZIP must be provided as ZIP,country_code"
            )

    else:
        raise HTTPException(
            status_code=400,
            detail="Provide city, lat/lon, or ZIP/country"
        )
  
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

async def getweather_api(request,city):
        api_url = "https://api.openweathermap.org/data/2.5/weather"
        location = await request.app.mongodb["location"].find_one({"name": city.title()})
     
    
        params ={
            "lat": location["coordinates"]["lat"],
            "lon": location["coordinates"]["lon"],
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

async def getweather5days_api(request,city):
        api_url = "https://api.openweathermap.org/data/2.5/forecast"
        location = await request.app.mongodb["location"].find_one({"name": city.title()})
     
    
        params ={
            "lat": location["coordinates"]["lat"],
            "lon": location["coordinates"]["lon"],
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
