from fastapi import FastAPI
import os
from .routes import api, location, current , fiveday , history

from motor.motor_asyncio import AsyncIOMotorClient


from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
   
    await startup_db_client(app)
    yield

    await shutdown_db_client(app)



async def shutdown_db_client(app):
    app.mongodb_client.close()
    print("Database disconnected.")

async def startup_db_client(app):
    app.mongodb_client = AsyncIOMotorClient(
        os.getenv("MONGODB_URI")
    )

    await app.mongodb_client.admin.command("ping")

    app.mongodb = app.mongodb_client["weather"]

    print("MongoDB connected successfully!")
app = FastAPI(lifespan=lifespan)


@app.get("/")
def main():
    return {"status":"running"}


@app.get("/health")
def health_check():
    return {"health":"okok"}

app.include_router(location.router)
app.include_router(current.router)
app.include_router(fiveday.router)
app.include_router(history.router)

