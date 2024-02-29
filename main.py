import fastapi
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from Routers.user import user
from Routers.shipments import shipments
from Routers.devicedata import devicedata
app=FastAPI()
templates = Jinja2Templates(directory="Templates")
app.mount("/static",StaticFiles(directory="./Routers/static"),name="static")

app.include_router(user)
app.include_router(shipments)
app.include_router(devicedata)

