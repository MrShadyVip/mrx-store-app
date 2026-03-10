from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.supabase_client import supabase

app = FastAPI(title="MrVIP Store API", description="الخلفية الخاصة بمتجر MrVIP")

# إعداد CORS - هذا هو الحل!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # في الإنتاج، حدد المواقع المسموحة
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "MrVIP Store API يعمل بنجاح"}

@app.get("/categories")
def get_categories():
    response = supabase.table("categories").select("*").execute()
    return response.data

@app.get("/users/{user_id}/balance")
def get_balance(user_id: int):
    response = supabase.table("users").select("balance").eq("id", user_id).execute()
    if response.data:
        return {"balance": response.data[0]["balance"]}
    return {"balance": 0}

@app.post("/users")
def create_user(user: dict):
    # التحقق من وجود المستخدم
    existing = supabase.table("users").select("*").eq("id", user["id"]).execute()
    if not existing.data:
        # إضافة مستخدم جديد
        supabase.table("users").insert({
            "id": user["id"],
            "username": user.get("username", ""),
            "first_name": user.get("first_name", ""),
            "balance": 0
        }).execute()
    return {"status": "success"}