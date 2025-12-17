# Travel Details Calculation

This project is a full-stack web application for uploading, viewing, and analyzing trip data from GPS tracks.

## Features

- User authentication (Sign up and Login)
- Upload trip data in CSV format
- View a list of uploaded trips
- See trip details including a map of the route
- Basic trip statistics

## Project Structure

The project is a monorepo with two main parts:

- `client/`: A React frontend built with Vite and TypeScript.
- `server/`: A Node.js/Express backend with TypeScript.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Travel_Details_Calculation
```

### 2. Set up the server

Navigate to the server directory and install the dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following environment variables:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Start the server:

```bash
npm start
```

The server will be running on `http://localhost:3000` (or the port specified in your environment).

### 3. Set up the client

In a new terminal, navigate to the client directory and install the dependencies:

```bash
cd client
npm install
```

Start the client development server:

```bash
npm run dev
```

The client will be running on `http://localhost:5173` (or another port if 5173 is busy).

## Available Scripts

### Client (`client/`)

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the source code.

### Server (`server/`)

- `npm start`: Starts the development server using `ts-node-dev`.

