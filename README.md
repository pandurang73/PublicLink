```bash
python manage.py migrate
```

Start the Backend Server:
```bash
python manage.py runserver
```
The backend will run at `http://127.0.0.1:8000/`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the Frontend Development Server:
```bash
npm run dev
```
The frontend will typically run at `http://localhost:5173/`.

## 🧪 Usage

1. **Register** as a user (Citizen).
2. **Login** and navigate to the "Raise Issue" page.
3. **Upload an image** of a civic issue.
4. **Submit** the issue.
5. **Representatives** can login to view and update the status of issues.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License.
