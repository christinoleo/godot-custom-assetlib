# Backend

The essence of the backend is an implementation of an API to handle the expected api endpoints of godot. They are:
* URL/asset-library/api/configure
* URL/asset-library/api/asset
* URL/asset-library/api/asset/{id}

All of them are get requests.

## Quick start

To run the backend, make sure that you have all requirements.txt installed with `pip install -r requirements.txt`, preferably inside your own python virtual environment. I used for development `python3.8`.

Start the backend with 
```
cd app
python3.8 main.py
```

And you'll have a localhost on port 80. You can use FastAPI's auto docs url to try the api out: `http://localhost/api/docs/`, and remember to authenticate with the test user.

The existing configuration is in [the dot.env file](./local_storage/dot.env). For testing, there is a default user set up in the same file and also two csv files with dummy data for the APIs. The dummy data is loaded with the Pandas connector from [fastapi-crud-orm-connector](https://github.com/christinoleo/fastapi_crud_orm_connector), which is also developed by me for research purposes, **so it is by no means production-ready or bug-free**. It is a convenient way to use rdb databases (such as sqlite, mariadb, mysql and postgres) or mongodb database as the data source with user and godot datasets. It also has all authentication needed for fastapi with JWT tokens implemented for authentication. 

## User database configuration

[This file](./app/core/auth.py) configures how to fetch users. See the required environment variables over there to set up your database accordingly (being sqlite, rdb or mongodb, which are the supported ones). By default, if no user database is given, it sets up an in-memory dictionary to match users, including the test user that can be set through environment variables.