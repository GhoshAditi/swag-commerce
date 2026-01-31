"""Test signup and signin APIs"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_signup():
    """Test user signup"""
    print("\n=== Testing Signup ===\n")
    
    # Try to sign up a new user
    signup_data = {
        "email": "testuser2026@example.com",
        "password": "test123456",
        "name": "Test User 2026",
        "tier": 2
    }
    
    print(f"📤 Signing up: {signup_data['email']} with Tier {signup_data['tier']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Status: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"✅ Signup successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Tier: {data['user']['tier']}")
            print(f"   Token: {data['access_token'][:30]}...")
            return data['access_token']
        else:
            print(f"❌ Signup failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_signin():
    """Test user signin"""
    print("\n=== Testing Signin ===\n")
    
    # Try to sign in with existing user
    signin_data = {
        "email": "rudra@gmail.com",
        "password": "Pavi@1234"
    }
    
    print(f"📤 Signing in: {signin_data['email']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signin",
            json=signin_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Status: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"✅ Signin successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Tier: {data['user']['tier']}")
            print(f"   Token: {data['access_token'][:30]}...")
            return data['access_token']
        else:
            print(f"❌ Signin failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_products(token):
    """Test fetching products with authentication"""
    print("\n=== Testing Products API ===\n")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/products/", headers=headers)
        
        print(f"📥 Status: {response.status_code}")
        
        if response.ok:
            products = response.json()
            print(f"✅ Fetched {len(products)} products")
            for p in products:
                print(f"   - {p['name']} (Tier {p['tier']})")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    # Test signup
    token = test_signup()
    
    # Test signin
    if not token:
        token = test_signin()
    
    # Test products if we have a token
    if token:
        test_products(token)
    
    print("\n" + "="*50 + "\n")
