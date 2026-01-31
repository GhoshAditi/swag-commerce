"""Test cart endpoint with requests"""
import requests
import json

url = "http://localhost:8000/api/cart/calculate"
data = {
    "items": [
        {
            "product_id": "test-1",
            "name": "Test Product",
            "price": 50.0,
            "quantity": 2
        }
    ],
    "coupon_codes": ["SAVE20"]
}

print(f"Testing: POST {url}")
print(f"Data: {json.dumps(data, indent=2)}")
print()

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
