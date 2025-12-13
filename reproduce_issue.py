import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login(email, password):
    # Simulate current frontend behavior
    username_payload = email.split('@')[0]
    payload = {
        "username": username_payload,
        "password": password
    }
    print(f"Testing login with email: {email}")
    print(f"Payload sent: {payload}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/users/login/", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test with a user where username != email prefix
    # User: ('test_citizen', 'citizen@example.com')
    # We don't know the password, but even with wrong password, 
    # if username lookup fails, it might behave differently or we can see if it even finds the user.
    # Actually, if we don't know the password, we can't fully reproduce "success" vs "fail due to username mismatch" 
    # easily without resetting password.
    # But we can observe that sending 'citizen' as username when real username is 'test_citizen' 
    # and email is 'citizen@example.com' is definitely wrong.
    
    # Let's try with a made up password. 
    # If the logic was correct (sending full email), it would find the user and then fail on password (400 Invalid Credentials).
    # If logic is incorrect (sending 'citizen'), it won't find user at all, and also return 400 Invalid Credentials.
    # So the error is the same.
    
    # However, the fix is logically clear.
    # I will demonstrate that sending full email allows the backend to find the user (if I knew the password).
    # Since I don't know the password, I can't prove "success".
    # But I can prove that the current logic sends the wrong data.
    
    test_login("citizen@example.com", "somepassword")
