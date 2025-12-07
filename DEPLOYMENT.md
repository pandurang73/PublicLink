# Deployment Guide for Civic Connect

This guide outlines the steps to deploy the Civic Connect application.

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Recommended for production, though MongoDB is currently configured)
- Git

## Backend Deployment (e.g., Render, Railway, Heroku)

1.  **Environment Variables**: Set the following environment variables on your hosting provider:
    - `SECRET_KEY`: A strong random string.
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: Your production domain (e.g., `api.publiclink.com`).
    - `CORS_ALLOWED_ORIGINS`: Your frontend domain (e.g., `https://publiclink.com`).
    - `MONGO_URI`: Connection string for your MongoDB database.
    - `MONGO_DB_NAME`: Database name.

2.  **Build Command**:
    ```bash
    pip install -r backend/requirements.txt
    python backend/manage.py collectstatic --noinput
    python backend/manage.py migrate
    ```

3.  **Start Command**:
    ```bash
    gunicorn civic_connect.wsgi
    ```
    *Note: Ensure the root directory for the command is `backend/` or adjust the path accordingly.*

## Frontend Deployment (e.g., Vercel, Netlify)

1.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://api.civicconnect.com`).

2.  **Build Command**:
    ```bash
    cd frontend
    npm install
    npm run build
    ```

3.  **Output Directory**: `frontend/dist`

## Local Production Test

To test the production setup locally:

1.  **Backend**:
    - Ensure `.env` has `DEBUG=False`.
    - Run `python manage.py collectstatic`.
    - Run `gunicorn civic_connect.wsgi`.

2.  **Frontend**:
    - Create `.env.production` in `frontend/` with `VITE_API_URL=http://localhost:8000`.
    - Run `npm run build`.
    - Serve the `dist` folder using `serve -s dist`.
