"""Test the Admin AI Copilot endpoint"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

print("🧪 Testing Admin AI Copilot\n")

# Test questions
questions = [
    "Which item is running lowest on stock?",
    "What was my total revenue today?",
    "Is coupon 'SUMMER50' still valid?",
]

for question in questions:
    print(f"❓ Question: {question}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/ai/chat",
            json={"question": question},
            headers={"Content-Type": "application/json"}
        )
        
        if response.ok:
            data = response.json()
            print(f"🤖 Answer: {data['answer']}\n")
        else:
            print(f"❌ Error {response.status_code}: {response.text}\n")
    
    except Exception as e:
        print(f"❌ Exception: {e}\n")

print("✅ Admin AI Copilot test complete!")
