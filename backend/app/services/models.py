from pydantic import BaseModel
import datetime
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class Location (BaseModel):
    city: str
    town: Optional[str] = None 
    country: str 
    postal_code: Optional[int] = None 
    coordinates: Optional[Coordinates] = None 
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdateLocation(BaseModel):
    city: Optional[str] = None
    town: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[int] = None
    coordinates: Optional[Coordinates] = None
   


class Temperature(BaseModel):
    day: float
    min: float
    max: float
    night: float
    eve: float
    morn: float


class FeelsLike(BaseModel):
    day: float
    night: float
    eve: float
    morn: float


class Weather(BaseModel):
    id: int
    main: str
    description: str
    icon: str


class DailyForecast(BaseModel):
    dt: int
    sunrise: int
    sunset: int
    moonrise: int
    moonset: int
    moon_phase: float
    temp: Temperature
    feels_like: FeelsLike
    pressure: int
    humidity: int
    dew_point: float
    wind_speed: float
    wind_deg: int
    wind_gust: float
    weather: List[Weather]
    clouds: int
    pop: float
    uvi: float


class WeatherResponse(BaseModel):
    lat: float
    lon: float
    timezone: str
    timezone_offset: int
    data: List[DailyForecast]
    prev: Optional[str] = None
    next: Optional[str] = None

class HourlyForecast(BaseModel):
    dt: int
    temp: float
    feels_like: float
    pressure: int
    humidity: int
    dew_point: float
    uvi: float
    clouds: int
    visibility: int
    wind_speed: float
    wind_deg: int
    wind_gust: float
    weather: List[Weather]
    alerts: Optional[List[str]] = None
    pop: float

