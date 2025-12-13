# Deployment Guide for Civic Connect

This guide outlines the steps to deploy the Civic Connect application.

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Recommended for production, though MongoDB is currently configured)
- Git

## 1. Backend Deployment (Render.com)

Render is a great choice for hosting Python/Django apps.

1.  **Create Account**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in with GitHub.
2.  **New Web Service**: Click **New +** -> **Web Service**.
3.  **Connect Repo**: Select your `PublicLink` repository.
4.  **Configuration**:
    -   **Name**: `publiclink-backend` (or similar)
    -   **Region**: Closest to you (e.g., Singapore or Frankfurt)
    -   **Branch**: `main`
    -   **Root Directory**: `backend` (Important!)
    -   **Runtime**: `Python 3`
    -   **Build Command**:
        ```bash
        pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
        ```
    -   **Start Command**:
        ```bash
        gunicorn civic_connect.wsgi
        ```
5.  **Environment Variables** (Click "Advanced" or "Environment"):
    Add the following keys and values:
    -   `PYTHON_VERSION`: `3.10.0` (or `3.12.0`)
    -   `SECRET_KEY`: (Generate a random string)
    -   `DEBUG`: `False`
    -   `ALLOWED_HOSTS`: `*` (For now, or use your Render URL e.g., `publiclink-backend.onrender.com`)
    -   `CORS_ALLOWED_ORIGINS`: `*` (You will update this after deploying the frontend. **IMPORTANT: Do not add a trailing slash!** e.g., `https://publiclink.vercel.app`)
    -   `MONGO_URI`: `your_mongodb_connection_string` (e.g., from MongoDB Atlas)
    -   `MONGO_DB_NAME`: `publiclink_db`

6.  **Deploy**: Click **Create Web Service**. Wait for the build to finish.
7.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://publiclink-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel is optimized for Vite/React apps.

1.  **Create Account**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2.  **New Project**: Click **Add New...** -> **Project**.
3.  **Import Repo**: Import your `PublicLink` repository.
4.  **Configuration**:
    -   **Framework Preset**: `Vite` (Should detect automatically)
    -   **Root Directory**: Click `Edit` and select `frontend`.
5.  **Build & Output Settings**:
    -   **Build Command**: `npm run build` (Default)
    -   **Output Directory**: `dist` (Default)
6.  **Environment Variables**:
    -   `VITE_API_URL`: Paste your **Render Backend URL** here (e.g., `https://publiclink-backend.onrender.com`).
        *Note: Do not add a trailing slash `/`.*
7.  **Deploy**: Click **Deploy**.
8.  **Finalize**:
    -   Once deployed, copy your new Frontend URL (e.g., `https://publiclink.vercel.app`).
    -   **Go back to Render Dashboard** -> Environment Variables.
    -   Update `CORS_ALLOWED_ORIGINS` to your Vercel URL (e.g., `https://publiclink.vercel.app`). **Ensure there is NO trailing slash `/` at the end.**
    -   Update `ALLOWED_HOSTS` to include your Render URL if you set it to `*` earlier.
