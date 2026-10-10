# RoomieFit Backend

**A MERN-stack platform for finding compatible roommates and discovering rental properties.**

RoomieFit helps people find roommates who match their lifestyle preferences while also helping property owners list their properties and connect with potential tenants.

This repository contains the backend API responsible for authentication, user profiles, roommate preferences, property listings, and interest management.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Models](#database-models)
- [API Modules](#api-modules)
- [Request Lifecycle](#request-lifecycle)
- [Authentication and Security](#authentication-and-security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Error Handling](#error-handling)
- [Testing the APIs](#testing-the-apis)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

## Overview

Finding a suitable roommate is not just about sharing rent. People also need compatibility in terms of cleanliness, sleep schedules, food preferences, social habits, and other lifestyle choices.

RoomieFit addresses two related problems:

1. **For users:** Discover rental properties and find potential roommates with compatible lifestyles.
2. **For hosts:** List rental properties, share property details, and connect with interested users.

The backend exposes REST APIs that allow the frontend to communicate with the database and application logic securely.

## Core Features

### Authentication and User Management
- User registration and login.
- Password hashing before storing credentials.
- JWT-based authentication using cookies.
- Logout and authentication handling.
- Role-based access for users and hosts.

### Lifestyle Profiles
- Store and manage roommate preferences.
- Maintain information such as target city, budget, sleep schedule, cleanliness, and food preferences.
- Support future compatibility scoring between potential roommates.

### Property Listings
- Create and manage property listings.
- Store rental information, location, facilities, and other property details.
- Restrict property management operations to authorized hosts.

### Interest Management
- Organize user interest in properties or other platform opportunities.
- Connect interested users with relevant listings and hosts.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and API routing |
| MongoDB | NoSQL database |
| Mongoose | Database schemas, models, and queries |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| cookie-parser | Reading authentication cookies |
| validator | Input validation |

## Project Architecture

RoomieFit follows a **modular monolithic architecture**. All backend modules run within one application, but responsibilities are separated into models, routes, controllers, validators, middleware, and configuration.

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Listing.js
│   │   └── Interest.js
│   ├── routes/
│   ├── controllers/
│   ├── validators/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── hostOnly.js
│   │   └── errorHandler.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

*Note: This tree describes the intended module organization. Expand the routes, controllers, and validators directories with their actual filenames when documenting the final repository.*

### What does each directory do?

**`config/`** — Contains application configuration, including the MongoDB connection.

**`models/`** — Defines the data structure, field constraints, and relationships stored in MongoDB.

**`routes/`** — Maps HTTP methods and URL paths to the relevant controller functions.

**`controllers/`** — Contains the application logic for processing requests and generating responses.

**`validators/`** — Checks incoming data before it is used by the application.

**`middleware/`** — Contains reusable request-processing logic for authentication, role authorization, and error handling.

**`app.js`** — Configures the Express application, middleware, routes, and centralized error handling.

**`server.js`** — Starts the server and coordinates application startup with database connectivity.

## Database Models

RoomieFit uses Mongoose models to organize application data.

### 1. User

Stores account and authentication information.

Typical fields include:

- `name` — User's name.
- `email` — Unique email address.
- `password` — Hashed password.
- `image` — Optional profile image.
- `role` — Account role, such as `user` or `host`.
- `createdAt` and `updatedAt` — Timestamps.

### 2. Profile

Stores lifestyle information used for roommate discovery.

Relevant fields may include:

- `userId` — Reference to the associated User.
- `age` and `gender`.
- `currentCity` and `targetCity`.
- `budget` — Rental budget information.
- `sleepSchedule`.
- `cleanliness`.
- `foodPreference`.
- `smoking` and `drinking`.
- `socializing`.
- `noiseTolerance`.

These preferences can later be used to calculate roommate compatibility scores.

### 3. Listing

Represents a property published by a host.

Its data can include the host reference, property title, description, location, rent, photos, facilities, and other listing details, depending on the implemented schema.

### 4. Interest

Represents an interest or interaction associated with a user and a relevant platform resource. Its exact fields and relationships are defined by the implemented Mongoose schema.

## API Modules

The backend is organized around the following API modules.

| Module | Responsibility |
|---|---|
| Authentication | Signup, login, logout, and identity verification |
| Profile | Create, retrieve, and update lifestyle information |
| Listing | Create, retrieve, update, and delete property listings |
| Interest | Manage user interest and related interactions |

All API paths and HTTP methods should be documented from the actual route definitions. The table above describes the modules, not a guarantee that every listed operation has been implemented.

### Standard API Response

Successful responses should return meaningful JSON data and an appropriate HTTP status code.

Example:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error responses should communicate what went wrong without exposing sensitive internal details.

```json
{
  "success": false,
  "message": "Resource not found"
}
```

These examples illustrate the recommended response format; use the response structure implemented by the controllers.

## Request Lifecycle

A typical API request passes through the following stages:

1. The client sends an HTTP request.
2. Express parses the request body and cookies.
3. Authentication middleware verifies the JWT when the endpoint requires a logged-in user.
4. Authorization middleware checks whether the user has the required role or ownership permissions.
5. Validation logic checks the incoming data.
6. The route invokes the appropriate controller.
7. The controller interacts with Mongoose models and MongoDB.
8. The server returns a JSON response.
9. Errors are passed to centralized error-handling middleware where applicable.

For example, a host updating a property should be authenticated and authorized to modify that particular listing. Being logged in as a host alone should not grant permission to edit another host's property.

## Authentication and Security

RoomieFit uses several backend security mechanisms.

- **Password hashing:** Passwords are hashed using bcrypt rather than stored as plain text.
- **JWT authentication:** Tokens are verified to identify authenticated users.
- **HTTP-only cookies:** The authentication cookie should be configured to reduce exposure to client-side JavaScript.
- **Role-based authorization:** Host-only operations are restricted to appropriate accounts.
- **Ownership checks:** Users must not be able to modify resources they do not own.
- **Input validation:** Incoming data is checked before database operations.
- **Centralized error handling:** Errors are handled consistently without exposing secrets or sensitive implementation details.
- **Environment variables:** Database credentials and authentication secrets are kept outside source code.

Cookie security settings, CORS configuration, request limits, and other production protections should be reviewed before deployment.

## Getting Started

### Prerequisites

Install the following before running the backend:

- Node.js and npm.
- A MongoDB database, either local MongoDB or MongoDB Atlas.
- Git.
- An API client such as Postman for testing.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RoomieFit/backend
```

Replace `<repository-url>` with the actual repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use the actual environment variable names expected by the application. If the code uses a different name for the MongoDB connection string, update this example accordingly.

Never commit real database credentials or authentication secrets to Git.

### 4. Start the Server

Check the scripts available in `package.json`.

For a development script named `dev`, run:

```bash
npm run dev
```

If the project does not define that script, use the existing script or add the appropriate development command.

For example, if the entry point is `src/server.js` and nodemon is installed:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

Once the database connection succeeds and the server starts, the backend is ready to receive requests.

## Error Handling

The backend should use suitable HTTP status codes to communicate outcomes.

| Status | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request data |
| `401 Unauthorized` | Missing, invalid, or expired authentication |
| `403 Forbidden` | Authenticated user lacks permission |
| `404 Not Found` | Requested resource does not exist |
| `409 Conflict` | Resource conflicts with an existing record |
| `500 Internal Server Error` | Unexpected server-side failure |

The exact status codes depend on the implemented controller and error-handler logic.

## Testing the APIs

Before using the backend with the frontend, test each API module independently.

Recommended checks:

- Register a new user and test duplicate registration.
- Log in with valid and invalid credentials.
- Test authenticated endpoints with missing, invalid, and expired tokens.
- Create and update a lifestyle profile.
- Verify that a host cannot modify another host's listing.
- Test listing retrieval, invalid IDs, and missing resources.
- Test invalid request bodies and missing required fields.
- Verify that logout handles the authentication cookie correctly.
- Confirm that errors return the expected status codes and JSON responses.

Use Postman or another API client to test request bodies, cookies, headers, and responses.

## Future Improvements

Potential improvements as the product develops include:

- Lifestyle-based roommate compatibility scoring.
- Advanced property search and filtering.
- Pagination, sorting, and location-based discovery.
- Property image uploads and storage.
- Reviews and ratings.
- Automated API tests.
- API documentation using OpenAPI/Swagger.
- Rate limiting, logging, and production monitoring.
- Deployment with environment-specific configuration.

These are potential enhancements, not claims that the features are already implemented.

## Contributing

Contributions should follow the existing modular structure.

1. Create a feature branch.
2. Keep routes, controllers, models, and validation logic separated.
3. Validate user input and enforce authorization on protected operations.
4. Test the affected APIs.
5. Submit a pull request describing the change.

## Project Status

RoomieFit's backend MVP has its main architectural modules in place. API testing and verification should be completed before the backend is considered ready for production.

---

**RoomieFit — Better spaces, better roommates.**
