from fastapi import APIRouter
from app.api.models import Product, UserQuery
from app.services.product_service import get_initial_products
from app.services.rag_service import get_rag_response, refresh_index

router = APIRouter()

@router.get("/api/initial-products", response_model=list[Product])
async def initial_products():
    return await get_initial_products()

@router.post("/api/query")
async def query(user_query: UserQuery):
    response = await get_rag_response(user_query.query)
    return {"results": response}

@router.post("/api/refresh-index")
async def refresh_rag_index():
    return await refresh_index()