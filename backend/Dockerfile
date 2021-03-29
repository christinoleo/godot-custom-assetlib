  
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

COPY ./requirements.txt /requirements.txt
RUN pip install -r requirements.txt

COPY ./app /app
COPY ./local_storage /local_storage
WORKDIR /app

RUN pip install -r requirements.txt


