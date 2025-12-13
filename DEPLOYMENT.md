# Deployment Guide for Civic Connect (PublicLink)

This guide provides step-by-step instructions to deploy the Civic Connect application with **Backend on Render** and **Frontend on Vercel**.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.10+ | For backend |
| Node.js | 18+ | For frontend |
| MongoDB | Atlas recommended | Free tier available |
| Git | Latest | For deployment |

**Accounts Required:**
- [Render.com](https://render.com) - Backend hosting
- [Vercel.com](https://vercel.com) - Frontend hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | ✅ | `django-insecure-xyz...` | Django secret key (generate unique for production) |
| `DEBUG` | ✅ | `False` | Set to `False` in production |
| `ALLOWED_HOSTS` | ✅ | `publiclink-backend.onrender.com` | Your Render backend URL (no https://) |
| `CORS_ALLOWED_ORIGINS` | ✅ | `https://publiclink.vercel.app` | Frontend URL (**NO trailing slash!**) |
| `MONGO_URI` | ✅ | `mongodb+srv://user:pass@cluster...` | MongoDB Atlas connection string |
| `MONGO_DB_NAME` | ✅ | `publiclink_db` | Database name |
| `PYTHON_VERSION` | ⚠️ | `3.10.0` | Required by Render |

### Frontend Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ | `https://publiclink-backend.onrender.com` | Backend URL (**NO trailing slash!**) |

> [!IMPORTANT]
> **Never add trailing slashes** to URLs in environment variables. This causes API routing issues.
> - ✅ Correct: `https://publiclink-backend.onrender.com`
> - ❌ Wrong: `https://publiclink-backend.onrender.com/`

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (M0 free tier is sufficient)
3. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Set username and password (save these!)
4. Whitelist IPs:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (for Render compatibility)
5. Get connection string:
   - Go to **Database** → **Connect** → **Drivers**
   - Copy the connection string and replace `<password>` with your password

---

## Step 2: Deploy Backend to Render

1. **Create Account**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in with GitHub

2. **New Web Service**: Click **New +** → **Web Service**

3. **Connect Repo**: Select your `PublicLink` repository

4. **Configuration**:
   | Setting | Value |
   |---------|-------|
   | Name | `publiclink-backend` |
   | Region | Closest to you (e.g., Singapore) |
   | Branch | `main` |
   | **Root Directory** | `backend` |
   | Runtime | `Python 3` |

5. **Build Command**:
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```

6. **Start Command**:
   ```bash
   gunicorn civic_connect.wsgi
   ```

7. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):

   Add each variable from the Backend Environment Variables table above.

8. **Deploy**: Click **Create Web Service**

9. **Verify**: Once deployed, test the health endpoint:
   ```
   https://your-backend-url.onrender.com/api/health/
   ```
   Should return: `{"status": "ok"}`

---

## Step 3: Deploy Frontend to Vercel

1. **Create Account**: Go to [vercel.com](https://vercel.com/) and log in with GitHub

2. **New Project**: Click **Add New...** → **Project**

3. **Import Repo**: Import your `PublicLink` repository

4. **Configuration**:
   | Setting | Value |
   |---------|-------|
   | Framework Preset | `Vite` (auto-detected) |
   | **Root Directory** | Click `Edit` → select `frontend` |
   | Build Command | `npm run build` (default) |
   | Output Directory | `dist` (default) |

5. **Environment Variables**:
   - `VITE_API_URL` = Your Render backend URL (e.g., `https://publiclink-backend.onrender.com`)

6. **Deploy**: Click **Deploy**

---

## Step 4: Post-Deployment Configuration

After both are deployed:

1. **Update Backend CORS**:
   - Go to Render Dashboard → Your service → Environment
   - Update `CORS_ALLOWED_ORIGINS` to your Vercel URL
   - Example: `https://publiclink.vercel.app`
   - **Redeploy** the backend

2. **Update Backend ALLOWED_HOSTS** (if not using `*`):
   - Add your Render URL: `publiclink-backend.onrender.com`

---

## Verification Checklist

After deployment, verify everything works:

- [ ] Backend health check: `https://backend-url/api/health/` returns `{"status": "ok"}`
- [ ] Frontend loads without errors
- [ ] No CORS errors in browser console (F12 → Console)
- [ ] User signup works
- [ ] User login works
- [ ] Issues can be created and viewed

---

## Troubleshooting

### CORS Errors

**Symptom**: Console shows "Access-Control-Allow-Origin" errors

**Solutions**:
1. Check `CORS_ALLOWED_ORIGINS` has your exact frontend URL
2. Ensure **NO trailing slash** in the URL
3. Redeploy backend after changing environment variables

### API Connection Errors

**Symptom**: Frontend shows "Network Error" or "Failed to fetch"

**Solutions**:
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check backend is running: visit `https://backend-url/api/health/`
3. Ensure **NO trailing slash** in `VITE_API_URL`

### MongoDB Auth Failed

**Symptom**: Backend logs show `pymongo.errors.OperationFailure: bad auth`

**Solutions**:
1. Check `MONGO_URI` password is URL-encoded (special characters like `@` → `%40`)
2. Verify database user exists in MongoDB Atlas
3. Check IP whitelist includes `0.0.0.0/0`

### 404 on Page Refresh (Vercel)

**Symptom**: Refreshing any page except home shows 404

**Solution**: Ensure `vercel.json` exists in `frontend/` folder with rewrites config (already added)

---

## Local Development

To run locally before deployment:

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` - frontend will connect to `http://localhost:8000` automatically.

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health/` | GET | Health check |
| `/api/users/register/` | POST | User registration |
| `/api/users/login/` | POST | User login |
| `/api/users/profile/` | GET/PUT | User profile |
| `/api/issues/` | GET/POST | List/Create issues |
| `/api/issues/<id>/` | GET/PUT/DELETE | Issue details |
| `/api/issues/<id>/comments/` | GET/POST | Issue comments |
| `/api/issues/<id>/escalate/` | POST | Escalate issue |
| `/api/issues/notifications/` | GET | User notifications |
