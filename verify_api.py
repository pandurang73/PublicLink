import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_api():
    print("Testing API...")
    
    # 1. Signup
    print("\n1. Testing Signup...")
    signup_data = {
        "username": "api_test_user",
        "email": "api_test@example.com",
        "password": "Password@123",
        "confirm_password": "Password@123"
    }
    try:
        response = requests.post(f"{BASE_URL}/users/register/", json=signup_data)
        if response.status_code == 201:
            print("Signup Successful")
        elif response.status_code == 400 and "already exists" in response.text:
             print("User already exists (Expected if re-running)")
        else:
            print(f"Signup Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Signup Error: {e}")

    # 2. Login
    print("\n2. Testing Login...")
    login_data = {
        "username": "api_test_user",
        "password": "Password@123"
    }
    token = None
    try:
        response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
        if response.status_code == 200:
            print("Login Successful")
            token = response.json().get('token')
            print(f"Token: {token[:10]}...")
        else:
            print(f"Login Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"Login Error: {e}")
        return

    if not token:
        print("No token, skipping authenticated requests")
        return

    headers = {'Authorization': f'Token {token}'}

    # 3. Create Issue
    print("\n3. Testing Create Issue...")
    issue_data = {
        "title": "Test Issue from Script",
        "description": "This is a test issue created via API verification script.",
        "location": "Test Location",
        "category": "OTHER",
        "priority": "MEDIUM"
    }
    # Note: Image upload is multipart/form-data, skipping for simple json test or handling it if needed.
    # The view expects multipart if image is included, but let's try json for text fields if the view supports it, 
    # or we might need to use files parameter in requests.
    # Based on previous code, the frontend sends FormData.
    # Let's try sending as json first, if it fails we'll switch to multipart.
    # Actually, DRF DefaultParser usually handles JSON. But if we have FileField, we might need MultiPartParser.
    
    try:
        response = requests.post(f"{BASE_URL}/issues/", json=issue_data, headers=headers)
        if response.status_code == 201:
            print("Create Issue Successful")
            issue_id = response.json().get('id')
            print(f"Issue ID: {issue_id}")
        else:
            print(f"Create Issue Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Create Issue Error: {e}")

    # 4. List Issues
    print("\n4. Testing List Issues...")
    try:
        response = requests.get(f"{BASE_URL}/issues/", headers=headers)
        if response.status_code == 200:
            print("List Issues Successful")
            issues = response.json()
            print(f"Found {len(issues)} issues")
        else:
            print(f"List Issues Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"List Issues Error: {e}")

if __name__ == "__main__":
    test_api()
