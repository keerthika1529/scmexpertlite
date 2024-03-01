import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from Models.model import Newshipment
from Routers.user import get_current_user
from pymongo import MongoClient

load_dotenv()

shipments=APIRouter()
mongo_uri =  os.getenv("mongo_uri")
mongodb_connection = MongoClient(mongo_uri)

database = mongodb_connection["SCM"]
collection=database["signup"]
collection1=database["shipment"]

Device_data=database["Device_data"]
 
# #Initialize templates for HTML rendering
templates = Jinja2Templates(directory="Templates")


@shipments.get("/my_shipment")
def my_shipment(request: Request):
    try:
        return templates.TemplateResponse("my_shipment.html", {"request": request})
    except Exception as e:
        return e

@shipments.get("/myshipment", response_class=HTMLResponse)
async def my_shipment(request:Request,token: dict = Depends(get_current_user)):
    try:
        if token["Role"]=="admin":
            shipment = list(collection1.find({},{"_id":0}))
        else:
            shipment = list(collection1.find({"Email":token["Email"]},{"_id":0}))
        return JSONResponse(content=shipment,status_code=200)
    except Exception as e:
        return e


@shipments.get("/New_shipment", response_class=HTMLResponse)
async def newShipment(request: Request):
    try:
        return templates.TemplateResponse("New_shipment.html", {"request": request})
    except Exception as e:
        return e 


@shipments.post("/New_shipment")
def add_task(request: Request, shipment_number:str =Form(...), route_details: str =Form(...), device: str = Form(...), po_number: str = Form(...),
             ndc_number: str = Form(...), serial_number: str = Form(...),container_number: str = Form(...),goods_type: str = Form(...),
             expected_delivery_date: str = Form(...),delivery_number: str = Form(...),
             batch_id: str = Form(...),shipment_description: str = Form(...), user : dict =Depends(get_current_user)):
    try:
        # Check if the shipment number already exists
        if collection1.find_one({"Shipment_Number": shipment_number}):
          return JSONResponse(content={"msg": "Shipment number already exists", "status_code": 400})
        data = Newshipment(Email=user["Email"],Shipment_Number=shipment_number, container_number=container_number, Route_details=route_details, Goods_types=goods_type, Device=device,
                            Expected_Delivery_date=expected_delivery_date,Po_number=po_number,Delivery_number=delivery_number,Ndc_Number= ndc_number,
                            Batch_id= batch_id,Serial_number_of_goods= serial_number,Shipment_Description=shipment_description)
        New_shipment = collection1.insert_one(dict(data))
        return JSONResponse(content={"msg" :"created successfully"},status_code=200)
    except Exception:
        pass