from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_name: str = "FlowPilot API"
    environment: str = "development"
    allowed_origins: str = "http://localhost:3000"

settings = Settings()
logging.basicConfig(level=logging.INFO)
app = FastAPI(title=settings.app_name, version="0.1.0", docs_url="/docs" if settings.environment != "production" else None)

class LeadIntake(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str = Field(min_length=2, max_length=160)
    message: str = Field(min_length=10, max_length=4000)
    consent: bool

@app.get("/health", tags=["operations"])
async def health():
    return {"status": "ok", "service": "flowpilot-api"}

@app.post("/api/v1/leads", status_code=202, tags=["leads"])
async def accept_lead(payload: LeadIntake):
    if not payload.consent:
        raise HTTPException(status_code=422, detail="Consent is required.")
    # Persistence is deliberately not simulated. Wire this handler to the
    # secured Supabase Edge Function before accepting production traffic.
    return {"accepted": True, "status": "pending_integration", "message": "Validated; persistence adapter is not configured."}
