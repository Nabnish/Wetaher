

from typing import List, Optional
from datetime import datetime, timezone, date
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class Coordinates(BaseModel):
    lat: float
    lon:    float
class Location(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    zip: Optional[str] = None


class UpdateLocation(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    coordinates: Optional[Coordinates] = None


class WeatherCoordinates(BaseModel):
    lat: float
    lon: float


class WeatherLocation(BaseModel):
    name: str
    country: Optional[str] = None
    coordinates: WeatherCoordinates


class CurrentWeather(BaseModel):
    location_id: str
    location: WeatherLocation
    observed_at: int
    temperature_c: float
    feels_like_c: float
    humidity: int
    condition: str
    wind_speed: float
    created_at: datetime

class ForecastLocationCoordinates(BaseModel):
    lat: float
    lon: float


class ForecastLocation(BaseModel):
    name: str
    country: Optional[str] = None
    coordinates: ForecastLocationCoordinates


class ForecastEntry(BaseModel):
    observed_at: int
    forecast_at: str
    temperature_c: float
    feels_like_c: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    condition: str
    weather_main: str
   
    cloudiness: int
    wind_speed: float
    wind_degree: int
    probability_of_precipitation: float
    visibility: int


class FiveDayForecast(BaseModel):
    location_id: str
    location: ForecastLocation
    forecast: List[ForecastEntry]
    created_at: datetime



class TemperatureReading(BaseModel):
    time: datetime
    temperature: float


class LocationInfo(BaseModel):
    name: str
    country: str
    coordinates: Coordinates
    
class TemperatureRecord(BaseModel):
    location_id: str
    location: LocationInfo
    start_date: str
    end_date: str
    readings: List[TemperatureReading]
    created_at: datetime


