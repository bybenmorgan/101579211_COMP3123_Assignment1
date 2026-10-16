# COMP3123 Assignment 1 - Backend

This project is an employee managemet API built with Node.js, Express, and MongoDb. Users can sign up, log in, and manage their own employees. They can't view, update, or delete another user's employees.

I used Mongoose for the db models, bcrypt for passwords, JWT for auth, express-validator for validation, helmet for security headers, express-rate-limit for rate limiting, and Winston for logging.

## Running the project

I used Node.js 24 and npm 11 for local development.

```bash
git clone https://github.com/bybenmorgan/101579211_COMP3123_Assignment1.git
cd 101579211_COMP3123_Assignment1
npm ci
cp .env.example .env
```

The database runs in MongoDB Atlas. Create a database user, allow your IP address in atlas, and add your connection string to `.env`. The database name must be `comp3123_assignment1`.

| Var | What to enter |
| --- | --- |
| `PORT` | `8081` for local development |
| `NODE_ENV` | `development` |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your own generated signing secret |

To generate a JWT secret, run:

```bash
node -e 'console.log(require("node:crypto").randomBytes(32).toString("hex"))'
```

Start the server:

```bash
npm run dev
```

This restarts the server when files change. You can also use `npm start`.

The server connects to MongoDB before starting at `http://localhost:8081`. The `.env` file, `node_modules`, and logs aren't in Git.

## Project structure

The routes, controllers, services, models, middleware, and validators all have their own folders. Routes define the endpoints, controllers handle the requests and responses, and services handle the db operations.

`app.js` is where Express and middleware are set up. `server.js` connects to MongoDB and starts the server. Database settings are in `config`, and the logger is in `utils`.

## API endpoints

| Method | Endpoint | Success status |
| --- | --- | --- |
| GET | `/health` | 200 |
| POST | `/api/v1/user/signup` | 201 |
| POST | `/api/v1/user/login` | 200 |
| GET | `/api/v1/emp/employees` | 200 |
| POST | `/api/v1/emp/employees` | 201 |
| GET | `/api/v1/emp/employees/:eid` | 200 |
| PUT | `/api/v1/emp/employees/:eid` | 200 |
| DELETE | `/api/v1/emp/employees?eid=xxx` | 204 |

send request bodies as JSON.

Sign up needs a username, email, and password. Login accepts either a username or email with a password and returns a JWT

Employee requests need this header:

```text
Authorization: Bearer <token>
```

Creating or updating an employee requires `first_name`, `last_name`, `email`, `position`, `salary`, `date_of_joining`, and `department`. The salary needs to be a positive number, and the date format is `YYYY-MM-DD`.

DELETE uses the employee ID in the query string and returns a empty body when its successful.

## Authentication and ownership

Passwords are hashed with bcrypt before they're saved and they're never returned back in responses. Users and emails need to be unique. Both models have `created_at` and `updated_at` time stamps.

JWTs will expire after 1 hour. The auth middleware checks the token and confirms the user still exists.

Each employee has a `user` ObjectId linking it to its owner. The API gets this owner from the token instead of trusting a ID in the request body. Employee queries and ownership checks stop users from accessing each other's records.

## Validation and security

Validation checks required fields, text lengths, email addresses, dates, employee IDs, and salaries. Unexpected fields and bad JSON aren't accepted. Sign up passwords need at least 8 characters, a letter, and a number, with a max of 72 bytes.

Helmet adds security headers. Sig nup and login share a limit of 10 requests per IP, per minute. After that, requests return 429 until the limit resets. The counter is stored in memory, so it resets when the server restarts and is not shared between server instances.

Errors return JSON with an error message and validation details when needed:

- 400: invalid input
- 401: invalid login or missing, invalid, or expired token
- 403: employee belongs to another user
- 404: employee or route not found
- 409: duplicate username or email
- 429: too many authentication requests
- 500: unexpected server error

Server errors return a general message without shwoing internal details.

## Logging and health check

Winston writes logs to the console and `logs/app.log`. Logs include timestamps, request methods, paths, statuses, auth events, employee operations, and errors. Passwords, tokens, and private configuration values are not logged.

`GET /health` returns:

```json
{
  "status": "ok",
  "message": "API is running"
}
```

This confirms the API is responding. It does not check the database connection.

## Testing with Postman

Import `postman/COMP3123_Assignment1.postman_collection.json` and set `base_url`.

The collection includes test sign up and login details for two users. Register them first if you're using a new database. After logging in, put their tokens in the local `token_a` and `token_b` variables. Leave the shared token values empty.

These requests are for manual testing. Use the employee IDs returned by your db. To repeat deletion tests, make new temporary employees first. The expired token request needs an purposelly expired token signed by this API in `expired_token`.

I tested successful CRUD, invalid input, auth errors, duplicate users, rate limiting, and cross user access in both directions. Screenshots also show MongoDB ownership, hashed passwords, Helmet headers, logging, and the health check.

The controlled 500 test used the actual error handler in a temporary server on port 8082. Its `/test-error` route is not part of the main API.