from pydantic import BaseModel


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
    
class devicedata(BaseModel):
    Battery_Level:str
    Device_ID:str
    First_Sensor_Temperature:str
    Route_From:str
    Route_To:str