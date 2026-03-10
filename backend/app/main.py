from fastapi import FastAPI
from app.core.supabase_client import supabase

app = FastAPI(title="MrVIP Store API", description="الخلفية الخاصة بمتجر MrVIP")

@app.get("/")
def root():
    return {"message": "MrVIP Store API يعمل بنجاح"}

@app.get("/categories")
def get_categories():
    response = supabase.table("categories").select("*").execute()
    return response.data
