# Frontend Documentation

## Files and Functionalities

### `src/pages/Register.jsx`

This file contains the registration page component for the application. It allows new users to create an account by providing their name, email, and password. Upon successful registration, the user is logged in and redirected to the dashboard.

Key functionalities:
- Handles form submission to register a new user.
- Sends a POST request to the backend API to create a new user.
- Logs in the user upon successful registration.
- Redirects the user to the dashboard.

### `src/pages/Login.jsx`

This file contains the login page component for the application. It allows existing users to log in by providing their email and password. Upon successful login, the user is redirected to the dashboard.

Key functionalities:
- Handles form submission to log in a user.
- Sends a POST request to the backend API to authenticate the user.
- Logs in the user upon successful authentication.
- Redirects the user to the dashboard.

### `src/pages/Dashboard.jsx`

This file contains the dashboard page component for the application. It displays a list of events and allows users to join or share events. It also provides real-time updates on the number of attendees for each event.

Key functionalities:
- Fetches and displays a list of events from the backend API.
- Allows users to filter events by category or date.
- Provides real-time updates on the number of attendees for each event using Socket.IO.
- Allows users to join or share events.

### `src/pages/CreateEvent.jsx`

This file contains the create event page component for the application. It allows authenticated users to create new events by providing the event name, description, date, and time.

Key functionalities:
- Handles form submission to create a new event.
- Sends a POST request to the backend API to create a new event.
- Redirects the user to the dashboard upon successful event creation.

### `src/context/AuthContext.jsx`

This file contains the authentication context for the application. It provides authentication-related functionalities such as login, logout, and storing user data in local storage.

Key functionalities:
- Provides authentication context to the application.
- Stores user data in local storage upon login.
- Clears user data from local storage upon logout.
- Provides `login` and `logout` functions to manage user authentication.

### `src/components/ProtectedRoute.jsx`

This file contains the protected route component for the application. It ensures that only authenticated users can access certain routes. If a user is not authenticated, they are redirected to the registration page.

Key functionalities:
- Checks if the user is authenticated.
- Redirects unauthenticated users to the registration page.
- Allows authenticated users to access protected routes.

### `src/App.jsx`

This file contains the main application component that sets up the routes and provides the authentication context. It defines the routes for the login, registration, dashboard, and create event pages.

Key functionalities:
- Sets up the main routes for the application.
- Provides authentication context to the entire application.
- Protects certain routes using the `ProtectedRoute` component.


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run lint`

Runs ESLint to check for linting errors.

### `npm run preview`

Previews the production build locally.

## Styling

The project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`.

## ESLint Configuration

The project uses ESLint for linting. The configuration can be found in `eslint.config.js`.

## PostCSS Configuration

The project uses PostCSS for processing CSS. The configuration can be found in `postcss.config.js`.

## Vite Configuration

The project uses Vite as the build tool. The configuration can be found in `vite.config.js`.

## Public Assets

The `public` folder contains static assets like the Vite logo.

## License

This project is licensed under the MIT License.

# Swissmote Backend API Documentation

## Authentication Endpoints

### Register a new user
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

### Login a user
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

## Event Endpoints

### Create an event
**POST** `/api/events`

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "name": "Event Name",
  "description": "Event Description",
  "date": "2023-10-10",
  "time": "10:00 AM"
}
```

**Response:**
```json
{
  "_id": "event_id",
  "name": "Event Name",
  "description": "Event Description",
  "date": "2023-10-10",
  "time": "10:00 AM",
  "owner": "user_id"
}
```

### Get all events
**GET** `/api/events`

**Response:**
```json
[
  {
    "_id": "event_id",
    "name": "Event Name",
    "description": "Event Description",
    "date": "2023-10-10",
    "time": "10:00 AM",
    "owner": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

### Delete an event
**DELETE** `/api/events/:id`

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "message": "Event deleted"
}
```

## Real-time Updates

### Join an event
**Socket Event:** `joinEvent`

**Payload:**
```json
{
  "eventId": "event_id"
}
```

### Leave an event
**Socket Event:** `leaveEvent`

**Payload:**
```json
{
  "eventId": "event_id"
}
```

### Get attendee count for a specific event
**GET** `/api/event/:eventId/attendees`

**Response:**
```json
{
  "eventId": "event_id",
  "count": 10
}
```
