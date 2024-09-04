from pydantic import BaseModel

class Product(BaseModel):
    id: int
    title: str
    brief: str
    imageUrl: str
    link: str

class UserQuery(BaseModel):
    query: str