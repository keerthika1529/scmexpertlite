import fastapi
from fastapi.responses import HTMLResponse,RedirectResponse,JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, ExpiredSignatureError, JWTError
import jwt
from pydantic import BaseModel
import pymongo
from pymongo import MongoClient
from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext

import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request, Cookie
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

mongo_uri = "mongodb+srv://keerthika:keerthika@cluster0.68jkqi1.mongodb.net/"

mongodb_connection = MongoClient(mongo_uri)

database = mongodb_connection["SCM"]

collection=database["signup"]
collection1=database["shipment"]
 
# #Initialize templates for HTML rendering
templates = Jinja2Templates(directory="SCMXpert")

# # Creating an instance of CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 
# Function to hash a password
def hash_password(password: str):
    return pwd_context.hash(password)
 
def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


# Authentication part
# Function to get user details based on email from the MongoDB collection
def get_user(email: str):
    Existing_mail = collection.find_one({'Email': email})
    if not Existing_mail:
        return False
    else:
        return Existing_mail
 
# Function to authenticate a user based on username (email) and password
def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user["Password"]):
        return False
    return user

class Signup(BaseModel):                               
    UserName: str
    Email: str
    Password: str
    Confirm_Password: str
    Role:str="user"

class Newshipment(BaseModel):
    Email: str
    Shipment_Number:str
    container_number:str
    Route_details:str
    Goods_types:str
    Device:str
    Expected_Delivery_date:str
    Po_number:str
    Delivery_number:str
    Ndc_Number:str
    Batch_id:str
    Serial_number_of_goods:str
    Shipment_Description:str

# Global variables
# create = 0
# delete = 0
# update = 0
# mail = ""
# Role = ""

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_SECONDS = os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS")

# OAuth2PasswordBearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()    
    if expires_delta: 
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_SECONDS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload["exp"] <= datetime.utcnow().timestamp():
            raise ExpiredSignatureError("Token has expired")
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired",
                            headers={"WWW-Authenticate": "Bearer"})
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    # print(token)
    try:
        payload = decode_token(token)
        if payload and "sub" in payload and "email" in payload:
            user_data = collection.find_one({"Email": payload["email"]})
            # print(user_data,"user")
            if user_data :
                return user_data
    except JWTError:
        pass
    return None

@app.get("/", response_class=HTMLResponse)
def signup(request: Request):
    return templates.TemplateResponse("Signup.html", {"request": request})

# @app.post("/signup", response_class=HTMLResponse)
# def post_signup(request: Request, name: str = Form(...), email: str = Form(...), password: str = Form(...), confirmpassword: str = Form(...)):
#     # Check if the email already exists in the signup collection
#     hashed_password = hash_password(password)
#     if password != confirmpassword:
#          return HTMLResponse(content="Passwords do not match", status_code=400)
#     data = Signup(UserName=name, Email=email, Password=hashed_password, Confirm_Password=hashed_password)
#     sign_up=collection.insert_one(dict(data))
#     # Redirect to the login page upon successful signups
#     return RedirectResponse("/", status_code=303)


@app.post("/signup", response_class=HTMLResponse)
def post_signup(request: Request, name: str = Form(...), email: str = Form(...), password: str = Form(...), confirmpassword: str = Form(...)):
    existing_user = collection.find_one({"Email": email})
    if existing_user:
        return templates.TemplateResponse("signup.html", {"request": request, "message": "Email already exists"})
    hashed_password = hash_password(password)
    if password != confirmpassword:
        return templates.TemplateResponse("signup.html", {"request": request, "message": "Passwords do not match"})
    data = Signup(UserName=name, Email=email, Password=hashed_password, Confirm_Password=hashed_password)
    sign_up=collection.insert_one(dict(data))
    return RedirectResponse("/", status_code=303)


@app.post("/login", response_class=HTMLResponse)
def verify_user(request: Request, email: str = Form(...), password: str = Form(...)):
        user= authenticate_user(email,password)
        existing_user = collection.find_one({"Email": email})
        if user:
            access_token = create_access_token(data={"sub": user["UserName"], "email": user["Email"],"role":user["Role"]})
            # print(access_token)
            return JSONResponse(content={"token":access_token,"user":user["UserName"],"email": user["Email"],"role":user["Role"]},status_code=200)
    

@app.get("/Dashboard", response_class=HTMLResponse)
async def dashboard(request: fastapi.Request):
    return templates.TemplateResponse("Dashboard.html", {"request": request})


@app.get("/my_account", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("my_account.html", {"request": request})


@app.get("/my_shipment")
def my_shipment(request:Request):
    return templates.TemplateResponse("my_shipment.html", {"request": request})


@app.get("/myshipment", response_class=HTMLResponse)
async def my_shipment(request:Request,token: dict = Depends(get_current_user)):
    # print(token,"ship")
    try:
        if token["Role"]=="admin":
            shipment = list(collection1.find({},{"_id":0}))
        else:
            shipment = list(collection1.find({"Email":token["Email"]},{"_id":0}))
        # print(shipment)
        return JSONResponse(content=shipment,status_code=200)
    except Exception as e:
        return e
    

@app.get("/New_shipment", response_class=HTMLResponse)
async def dashboard(request: fastapi.Request):
    return templates.TemplateResponse("New_shipment.html", {"request": request})


@app.post("/New_shipment")
def add_task(request: Request, shipment_number:str =Form(...), route_details: str =Form(...), device: str = Form(...), po_number: str = Form(...),
             ndc_number: str = Form(...), serial_number: str = Form(...),container_number: str = Form(...),goods_type: str = Form(...),
             expected_delivery_date: str = Form(...),delivery_number: str = Form(...),
             batch_id: str = Form(...),shipment_description: str = Form(...), user : dict =Depends(get_current_user)):
            try:
                data = Newshipment(Email=user["Email"],Shipment_Number=shipment_number, container_number=container_number, Route_details=route_details, Goods_types=goods_type, Device=device,
                                    Expected_Delivery_date=expected_delivery_date,Po_number=po_number,Delivery_number=delivery_number,Ndc_Number= ndc_number,
                                    Batch_id= batch_id,Serial_number_of_goods= serial_number,Shipment_Description=shipment_description)
                New_shipment = collection1.insert_one(dict(data))
                return JSONResponse(content={"msg" :"created successfully"},status_code=200)
            except Exception:
                pass 


@app.get("/device_data", response_class=HTMLResponse)
async def dashboard(request: fastapi.Request):
    return templates.TemplateResponse("device_data.html", {"request": request})


@app.get("/admin", response_class=HTMLResponse)
def admin(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})

