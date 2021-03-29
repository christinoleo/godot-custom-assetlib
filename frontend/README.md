# Frontend

This is a javascript frontend to display the contents of the Custom Godot Asset Store. In its core, these libraries are in its implementation:
* React
* React-Admin
* Material UI

To start a server, use yarn or npm as such:
`npm run start` or `yarn run start` and connect to localhost:3000 in your browser.

Also start the backend and use the default test user from the [dot.env file](../backend/local_storage/dot.env) to connect to the admin panel, where you'll be able to see all assets and configurations and edit/add them to your heart's content! 

## Auth
There is an implementation of authentication using JWT token synced by REST to the backend specified at [the configuration file](./src/config/index.jsx). Auth is implemented through [the auth](./src/admin/authProvider.jsx) and connects to FastAPI authentication logic in the backend, storing the tokens in a DataContext in [this file](./src/utils/DataContext.jsx). The tokens are stored in memory throuth the [authProvider](./src/utils/auth.js).

By default, a test user can be used to log to the admin panel in when in development mode: `admin` `password`. If you wish to remove this user, see backend documentation.

## Connection to the backend

The code has two implementations to connect to the backend, one for React-Admin and a manual implementation for usage outside React-Admin.

## Production build

To build for production, there is no automation as of yet. Run the build command through npm/yarn and copy manually the contents of the build folder into the backend's frontend folder and uncomment at [main.py](../backend/app/main.py) the lines to serve these files from the backend. You can also choose to serve the static build of react from a separate server, such as AWS S3. Its you call.