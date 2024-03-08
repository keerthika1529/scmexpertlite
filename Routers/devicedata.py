import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
import fastapi
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pymongo import MongoClient

from Routers.user import get_current_user

load_dotenv()

devicedata=APIRouter()
mongo_uri =  os.getenv("mongo_uri")
mongodb_connection = MongoClient(mongo_uri)

database = mongodb_connection["SCM"]
collection=database["signup"]
collection1=database["shipment"]
Device_data=database["Device_data"]
 
# #Initialize templates for HTML rendering
templates = Jinja2Templates(directory="Templates")

@devicedata.get("/device_data", response_class=HTMLResponse)
async def dashboard(request: fastapi.Request):
    return templates.TemplateResponse("device_data.html", {"request": request})

# Route to get device data based on Device_ID
@devicedata.post("/device_data")
async def get_device_data(request: Request, token: dict = Depends(get_current_user)):
    try:
        if token:
            if token.get("Role")=="admin":
                data1 = await request.json()
                device_id = data1.get("Device_ID")
                if device_id:
                    device_data = list(Device_data.find({'Device_ID': int(device_id)}, {'_id': 0}))
                    if device_data:
                        return JSONResponse(content={"data": device_data}, status_code=200)
                return HTTPException(status_code=400, detail="Device Data Not Found")
            else:
                 return JSONResponse(content={"message": "Only admin can access device data"})
    except HTTPException as http_error:
            return JSONResponse(content={"message": http_error.detail})
    except Exception as e:
        return JSONResponse(content={"detail": str(e)}, status_code=500)