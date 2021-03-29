from pathlib import Path  # Python 3.6+ only

import uvicorn, os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

env_path = Path(__file__).parent.parent / 'local_storage' / 'dot.env'
load_dotenv(dotenv_path=env_path)

from api.v1.base import generate_routers
from core import config

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=80)

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
    response = await call_next(request)
    response.headers["Access-Control-Expose-Headers"] = '*'
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


appdirprefix = ''
if os.getenv('STAGE', 'dev').startswith('prod'):
    appdirprefix = os.getcwd() + '/app/'
app.mount("/static", StaticFiles(directory=appdirprefix+'frontend/static'), name="static")
templates = Jinja2Templates(directory=appdirprefix+'frontend')


@app.get("/", response_class=HTMLResponse, tags=["static website"])
@app.get("/admin", response_class=HTMLResponse, tags=["static website"])
@app.get("/login", response_class=HTMLResponse, tags=["static website"])
@app.get("/logout", response_class=HTMLResponse, tags=["static website"])
@app.get("/signup", response_class=HTMLResponse, tags=["static website"])
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


generate_routers(app)
