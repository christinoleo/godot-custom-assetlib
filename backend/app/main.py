import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from dotenv import load_dotenv

from pathlib import Path  # Python 3.6+ only

env_path = Path(__file__).parent.parent / 'local_storage' / 'dot.env'
load_dotenv(dotenv_path=env_path)

from api.v1.base import generate_routers
from core import config
from fastapi_crud_orm_connector.utils.rdb_session import SessionLocal

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8888)
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
)

origins = [
    "http://localhost:*",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    response.headers["Access-Control-Expose-Headers"] = '*'
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend")


@app.get("/", response_class=HTMLResponse)
@app.get("/admin", response_class=HTMLResponse)
@app.get("/map", response_class=HTMLResponse)
@app.get("/login", response_class=HTMLResponse)
@app.get("/logout", response_class=HTMLResponse)
@app.get("/signup", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


generate_routers(app)
