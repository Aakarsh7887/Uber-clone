**Backend API - User Routes**

- **File**: [backend/routes/user.routes.js](backend/routes/user.routes.js)
- **Controller**: [backend/controllers/user.controller.js](backend/controllers/user.controller.js)
- **Service**: [backend/services/user.service.js](backend/services/user.service.js)

**Overview**

This document describes the user-related API endpoints implemented in the backend. The router defined in `backend/routes/user.routes.js` registers a POST handler for `/register`. The full URL depends on where the router is mounted in your app (for example, `app.use('/users', userRoutes)` would make the full path `/users/register`).

**Endpoint: Register User**

- **Route**: `POST /register` (router-level)
- **Typical full path**: `POST /users/register` if the router is mounted at `/users`
- **Description**: Creates a new user, stores a hashed password, and returns a signed JWT plus the created user object (with the `password` field removed).
- **Files**: [backend/routes/user.routes.js](backend/routes/user.routes.js), [backend/controllers/user.controller.js](backend/controllers/user.controller.js), [backend/services/user.service.js](backend/services/user.service.js)

- **Headers**:
  - `Content-Type: application/json`

- **Request body (JSON)**:

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "secret123"
}
```

- **Validation rules (express-validator)**:
  - `email` must be a valid email
  - `fullname.firstname` minimum length 3
  - `password` minimum length 6

- **Success response (201 Created)**

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
    // other user fields except `password`
  }
}
```

- **Validation error response (400 Bad Request)**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
    // ...other validation errors
  ]
}
```

- **Server error (500 Internal Server Error)**

```json
{
  "error": "Internal server error"
}
```

**Implementation notes**

- The controller calls `UserModel.hashPassword(password)` to hash the password before creating the user.
- `UserService.createUser()` constructs the `fullname` object and creates the user model, then converts to a plain object and removes the `password` property before returning the user data.
- A JWT is signed in the controller via `jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY)`; ensure `JWT_SECRET_KEY` is set in environment variables.

**Next steps**

- Add docs for additional endpoints as they are implemented (login, profile, etc.).
