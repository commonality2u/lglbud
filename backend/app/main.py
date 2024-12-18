from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.upload.route import router as upload_router

app = FastAPI(title="Legal Buddy API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload_router, prefix="/api/upload", tags=["upload"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"} 