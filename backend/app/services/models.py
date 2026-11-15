from pydantic import BaseModel
import datetime
from typing import List, Optional

class Location (BaseModel):
    city = str
    town = str
    country = str 
    postal_code = int
    coordinates = str
    created_at = datetime.time
    updated_at = datetime.time

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

