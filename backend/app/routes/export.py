from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import os
import httpx
from .api import getweather_api
from bson import ObjectId
from fastapi.responses import JSONResponse
from bson import json_util

router = APIRouter(prefix="/api/v1/export",tags=["export"])

@router.get("/history/{record_id}")
async def history_export(request : Request, record_id : str):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    record = await request.app.mongodb["TemperatureRecord"].find_one({
        "_id": ObjectId(record_id)
    })

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.pop("_id", None)

    return JSONResponse(
        content=json_util.loads(json_util.dumps(record)),
        headers={
            "Content-Disposition": f'attachment; filename="weather_temperatures_{record_id}.json"'
        }
    )



@router.get("/currentforecast/{record_id}")
async def current_export(request : Request, record_id : str):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    record = await request.app.mongodb["CurrentWeather"].find_one({
        "_id": ObjectId(record_id)
    })

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.pop("_id", None)

    return JSONResponse(
        content=json_util.loads(json_util.dumps(record)),
        headers={
            "Content-Disposition": f'attachment; filename="weather_current_{record_id}.json"'
        }
    )


@router.get("/5dayforecast/{record_id}")
async def fiveday_export(request : Request, record_id : str):
    if not ObjectId.is_valid(record_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    record = await request.app.mongodb["FiveDayForecast"].find_one({
        "_id": ObjectId(record_id)
    })

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    record.pop("_id", None)

    return JSONResponse(
        content=json_util.loads(json_util.dumps(record)),
        headers={
            "Content-Disposition": f'attachment; filename="weather_5dayforecast_{record_id}.json"'
        }
    )
