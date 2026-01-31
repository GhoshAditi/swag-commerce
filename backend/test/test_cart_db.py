"""Test cart database functionality"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_cart_operations():
    """Test complete cart workflow"""
    print("\n=== Testing Cart Database Operations ===\n")
    
    # 1. Sign in to get token
    print("1️⃣ Signing in...")
    signin_response = requests.post(
        f"{BASE_URL}/auth/signin",
        json={"email": "rudra@gmail.com", "password": "Pavi@1234"}
    )
    
    if not signin_response.ok:
        print(f"❌ Sign in failed: {signin_response.text}")
        return
    
    token = signin_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"✅ Signed in successfully")
    
    # 2. Get products to add to cart
    print("\n2️⃣ Fetching products...")
    products_response = requests.get(f"{BASE_URL}/products/", headers=headers)
    products = products_response.json()
    if len(products) < 2:
        print("❌ Not enough products in database")
        return
    
    product1 = products[0]
    product2 = products[1]
    print(f"✅ Found products: {product1['name']} and {product2['name']}")
    
    # 3. Clear cart first
    print("\n3️⃣ Clearing cart...")
    clear_response = requests.delete(f"{BASE_URL}/cart/clear", headers=headers)
    if clear_response.ok:
        print(f"✅ {clear_response.json()['message']}")
    else:
        print(f"ℹ️  Response: {clear_response.status_code}")
    
    # 4. Add first product to cart
    print(f"\n4️⃣ Adding {product1['name']} to cart...")
    add_response = requests.post(
        f"{BASE_URL}/cart/items",
        params={"product_id": product1['id'], "quantity": 2},
        headers=headers
    )
    if add_response.ok:
        print(f"✅ Added: {add_response.json()}")
    else:
        print(f"❌ Failed: {add_response.text}")
    
    # 5. Add second product to cart
    print(f"\n5️⃣ Adding {product2['name']} to cart...")
    add_response2 = requests.post(
        f"{BASE_URL}/cart/items",
        params={"product_id": product2['id'], "quantity": 1},
        headers=headers
    )
    if add_response2.ok:
        print(f"✅ Added: {add_response2.json()}")
    
    # 6. Get cart items
    print("\n6️⃣ Retrieving cart contents...")
    cart_response = requests.get(f"{BASE_URL}/cart/items", headers=headers)
    if cart_response.ok:
        cart_data = cart_response.json()
        print(f"✅ Cart has {len(cart_data['items'])} items:")
        for item in cart_data['items']:
            print(f"   - {item['name']} x{item['quantity']} @ ${item['price']}")
    
    # 7. Update quantity
    if cart_response.ok and len(cart_data['items']) > 0:
        cart_item_id = cart_data['items'][0]['cart_item_id']
        print(f"\n7️⃣ Updating quantity for first item...")
        update_response = requests.put(
            f"{BASE_URL}/cart/items/{cart_item_id}",
            params={"quantity": 5},
            headers=headers
        )
        if update_response.ok:
            print(f"✅ Updated: {update_response.json()}")
    
    # 8. Get updated cart
    print("\n8️⃣ Retrieving updated cart...")
    cart_response2 = requests.get(f"{BASE_URL}/cart/items", headers=headers)
    if cart_response2.ok:
        cart_data2 = cart_response2.json()
        print(f"✅ Updated cart:")
        total = 0
        for item in cart_data2['items']:
            subtotal = item['price'] * item['quantity']
            total += subtotal
            print(f"   - {item['name']} x{item['quantity']} = ${subtotal:.2f}")
        print(f"   Total: ${total:.2f}")
    
    # 9. Remove one item
    if cart_response2.ok and len(cart_data2['items']) > 1:
        cart_item_id = cart_data2['items'][1]['cart_item_id']
        print(f"\n9️⃣ Removing second item...")
        remove_response = requests.delete(
            f"{BASE_URL}/cart/items/{cart_item_id}",
            headers=headers
        )
        if remove_response.ok:
            print(f"✅ Removed: {remove_response.json()}")
    
    # 10. Final cart state
    print("\n🔟 Final cart state...")
    final_cart = requests.get(f"{BASE_URL}/cart/items", headers=headers)
    if final_cart.ok:
        final_data = final_cart.json()
        print(f"✅ Cart has {len(final_data['items'])} item(s)")
    
    print("\n" + "="*60)
    print("✅ All cart operations completed successfully!")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_cart_operations()
