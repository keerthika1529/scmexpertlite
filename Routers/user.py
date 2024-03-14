import fastapi
from fastapi.responses import HTMLResponse,JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, ExpiredSignatureError, JWTError
import jwt
from pymongo import MongoClient
from fastapi import APIRouter, Form, Request
from fastapi.templating import Jinja2Templates
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request 
from datetime import datetime, timedelta
import re
from Models.model import Signup

load_dotenv()

user=APIRouter()

templates = Jinja2Templates(directory="Templates")

mongo_uri = os.getenv("mongo_uri")
mongodb_connection = MongoClient(mongo_uri)

database = mongodb_connection["SCM"]
users_data=database["signup"]
 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 
# Function to hash a password
def hash_password(password: str):
    return pwd_context.hash(password)
def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

# Authentication part
# Function to get user details based on email from the MongoDB collection
def get_user(email: str):
    try:
        Existing_mail = users_data.find_one({'Email': email})
        if not Existing_mail:
            return False
        else:
            return Existing_mail
    except Exception as e:
        return e

# Function to authenticate a user based on username (email) and password
def authenticate_user(email: str, password: str):
    try:
        user = get_user(email)
        if not user:
            return False
        if not verify_password(password, user["Password"]):
            return False
        return user
    except Exception as e:
       return e

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_SECONDS = os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS")

# OAuth2PasswordBearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    try:
        to_encode = data.copy()    
        if expires_delta: 
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(seconds=int(ACCESS_TOKEN_EXPIRE_SECONDS))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        return e 

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
    try:
        payload = decode_token(token)
        if payload and "sub" in payload and "email" in payload:
            user_data = users_data.find_one({"Email": payload["email"]})
            if user_data :
                return user_data
    except JWTError:
        return None


@user.get("/", response_class=HTMLResponse)
def signup(request: Request):
    try:
        return templates.TemplateResponse("Signup.html", {"request": request})
    except Exception as e:
        return e


@user.post("/signup", response_class=HTMLResponse)
def post_signup(request: Request, name: str = Form(None), email: str = Form(None), password: str = Form(None), confirmpassword: str = Form(None)):
    try:
        if not name:
            return JSONResponse(content={ "message": "Username is required"},status_code=400)
        if not email:
            return JSONResponse(content={ "message": "Email is required"},status_code=400)
        if '@' not in email:
            return JSONResponse(content={ "message": "Email should contain @"},status_code=400)
        if not password:
            return JSONResponse(content={ "message": "Password is required"},status_code=400)
        if not re.match(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}', password):
            return JSONResponse(content={ "message": "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"},status_code=400)
        if not confirmpassword:
            return JSONResponse(content={ "message": "Confirm Password is required"},status_code=400)
        existing_user = users_data.find_one({"Email": email})
        if existing_user:
            return JSONResponse(content={ "message": "Email already exists please try to Login"},status_code=400)
        if password != confirmpassword:
            return JSONResponse(content={ "message": "Passwords do not match"},status_code=400)
        hashed_password = hash_password(password)
        data = Signup(UserName=name, Email=email, Password=hashed_password, Confirm_Password=hashed_password)
        users_data.insert_one(dict(data))
        return JSONResponse(content={ "message": "Register Successfully"},status_code=200)
    except Exception as e:
        return JSONResponse(content={ "message": str(e)},status_code=500)


@user.post("/login", response_class=HTMLResponse)
def verify_user(request: Request, email: str = Form(...), password: str = Form(...)):
    try:
        user= authenticate_user(email,password)
        if not user:
            return JSONResponse(content={"message": "Invalid email or password"}, status_code=401)
        if user:
            access_token = create_access_token(data={"sub": user["UserName"], "email": user["Email"],"role":user["Role"]})
            return JSONResponse(content={"token":access_token,"user":user["UserName"],"email": user["Email"],"role":user["Role"]},status_code=200)
    except Exception as e:
        return e  


@user.get("/Dashboard", response_class=HTMLResponse)
async def dashboard(request: fastapi.Request):
    try:
        return templates.TemplateResponse("Dashboard.html", {"request": request})
    except Exception as e:
        return e  


@user.get("/my_account", response_class=HTMLResponse)
async def dashboard(request: Request):
    try:
        return templates.TemplateResponse("my_account.html", {"request": request})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})