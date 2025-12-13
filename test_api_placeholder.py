import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    # We will try to login with a user we know exists: 'pandurang' / 'pandurang@gmail.com'
    # We don't know the password.
    # But we can try to use the 'api_test_user' if we created it? No.
    
    # Let's try to fetch issues WITHOUT login if possible?
    # View says: permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # So GET /api/issues/ should work without auth!
    
    try:
        print("Fetching issues without auth...")
        response = requests.get(f"{BASE_URL}/api/issues/")
        print(f"Status Code: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"Data type: {type(data)}")
            if isinstance(data, list):
                print(f"Number of issues: {len(data)}")
                if len(data) > 0:
                    print(f"First issue sample: {data[0]}")
                    # Check reported_by structure
                    if 'reported_by' in data[0]:
                        print(f"reported_by: {data[0]['reported_by']}")
                        print(f"Type of reported_by: {type(data[0]['reported_by'])}")
            else:
                print(f"Data is not a list: {data}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_api()
