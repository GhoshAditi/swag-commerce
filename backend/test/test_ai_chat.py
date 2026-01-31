import asyncio
import aiohttp
import json


async def test_ai_chat():
    """Test the AI chat endpoint"""
    url = "http://localhost:8000/api/ai/chat"
    
    questions = [
        "Which item is running lowest on stock?",
        "What was my total revenue today?",
        "Is the coupon 'SUMMER50' still valid?"
    ]
    
    async with aiohttp.ClientSession() as session:
        for question in questions:
            print(f"\n{'='*60}")
            print(f"Question: {question}")
            print(f"{'='*60}")
            
            try:
                async with session.post(
                    url,
                    json={"message": question},
                    headers={"Content-Type": "application/json"}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        print(f"\nAI Response:")
                        print(data['response'])
                        print(f"\nContext used: {json.dumps(data.get('context_used', {}), indent=2)}")
                    else:
                        print(f"Error: HTTP {response.status}")
                        text = await response.text()
                        print(text)
            except Exception as e:
                print(f"Error connecting to backend: {e}")
                print("Make sure the backend is running on http://localhost:8000")
                return


if __name__ == "__main__":
    print("Testing AI Chat Endpoint...")
    print("Make sure your backend is running!")
    asyncio.run(test_ai_chat())
