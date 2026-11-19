
from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId
from pydantic import BaseModel,Field
from typing import List
from ..services import models
import json
from .locationapi import geolocation_api

router = APIRouter(prefix="/api/v1/location",tags=["location"])



@router.post("/insert",response_model=models.Location)
async def insert_location_user(    request: Request,location: models.Location):

    response = await geolocation_api(
        name=location.name,
        zip_country=location.zip,
        lat=location.coordinates.lat,
        lon=location.coordinates.lon
    )

    
    if "local_names" in response:
        response[0].pop("local_names", None)
    if isinstance(response, list):     
        response = response[0]
    response["coordinates"] = {"lat": response["lat"],"lon" : response["lon"]}
    response.pop("lat",None)
    response.pop("lon",None)

    result = await request.app.mongodb["location"].insert_one(response)
    inserted_location = await request.app.mongodb["location"].find_one({"_id": result.inserted_id})
    
    print("Inserted ID:", result.inserted_id)

    count = await request.app.mongodb["location"].count_documents({})
    print("Documents after insert:", count)
    return inserted_location

@router.get("/display",response_model=list[models.Location])
async def display_location(request : Request):
    result = await request.app.mongodb["location"].find().to_list(None)
    print(await request.app.mongodb["location"].count_documents({}))
    return result


@router.delete("/delete",response_model=dict)
async def delete_location(request: Request):
    result =  await request.app.mongodb["location"].delete_one({})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="not found")
    return {"message": "deleted successfully"}




@router.put("/update",response_model = models.Location)
async def update_location(location_update: models.UpdateLocation,request: Request):
    updated_result = await request.app.mongodb["location"].update_one({},{"$set": location_update.model_dump(exclude_unset=True)})
    if updated_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="not found or no update needed")
    updated_location = await request.app.mongodb["location"].find_one({})
    return updated_location