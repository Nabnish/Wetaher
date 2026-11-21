

from typing import List, Optional
from datetime import datetime, timezone, date
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class Coordinates (BaseModel):
    lat: float
    lon:    float
class Location (BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None 
    country: Optional[str] = None 
    coordinates : Optional[Coordinates] =  None
    zip: Optional[str] = None 
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdateLocation(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    coordinates : Optional[Coordinates] =  None


class Weather(BaseModel):
    id: int
    main: str
    description: str
    icon: str


class MainWeather(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    sea_level: Optional[int] = None
    grnd_level: Optional[int] = None


class Wind(BaseModel):
    speed: float
    deg: int
    gust: Optional[float] = None


class Clouds(BaseModel):
    all: int


class Sys(BaseModel):
    type: Optional[int] = None
    id: Optional[int] = None
    country: str
    sunrise: int
    sunset: int


class CurrentWeather(BaseModel):
    coord: Coordinates
    weather: List[Weather]
    base: str
    main: MainWeather
    visibility: int
    wind: Wind
    clouds: Clouds
    dt: int
    sys: Sys
    timezone: int
    id: int
    name: str
    cod: int


class ForecastMain(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int


class ForecastSys(BaseModel):
    pod: str


class ForecastItem(BaseModel):
    dt: int
    dt_txt: str
    main: ForecastMain
    weather: List[Weather]
    clouds: Clouds
    wind: Wind
    visibility: int
    pop: float
    sys: ForecastSys


class ForecastCity(BaseModel):
    name: str
    coord: Coordinates
    country: str
    timezone: int


class FiveDayForecast(BaseModel):
    cod: str
    message: int
    cnt: int
    list: List[ForecastItem]
    city: ForecastCity

class TemperatureRequest(BaseModel):
    name: str
    start_date: date
    end_date: date
    data_type: str 

class TemperatureReading(BaseModel):
    time: datetime
    temperature: float


class TemperatureRecord(BaseModel):
    coordinates: Coordinates
    start_date: date
    end_date: date
    temperatures: List[TemperatureReading]
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )