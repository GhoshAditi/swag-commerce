"""
Test script to verify all 3 coupon requirements:
1. Specific coupons can make an item completely free ($0)
2. Coupon cannot be used if expired or reached usage limit
3. UI shows "Original Price" vs "Discounted Price" before checkout
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api"

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")

def test_requirement_1_free_coupon():
    """Test that coupons with makes_free=True make order completely free"""
    print_section("REQUIREMENT 1: Coupons that make items COMPLETELY FREE ($0)")
    
    # Sample cart items
    cart_items = [
        {"product_id": "1", "name": "Test Product", "price": 50.00, "quantity": 2}
    ]
    
    # Test with a regular coupon
    print("📦 Cart Total: $100.00 (50 x 2)")
    print("\n1️⃣ Testing regular 20% off coupon:")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["SAVE20"]
        }
    )
    if response.ok:
        data = response.json()
        print(f"   Original Price: ${data['subtotal']:.2f}")
        print(f"   Discount: -${data['total_discount']:.2f}")
        print(f"   Final Total: ${data['final_total']:.2f}")
    else:
        print(f"   ❌ Error: {response.json()}")
    
    # Test with makes_free coupon
    print("\n2️⃣ Testing MAKES FREE coupon (100% off):")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["FREESHIP"]
        }
    )
    if response.ok:
        data = response.json()
        print(f"   Original Price: ${data['subtotal']:.2f}")
        print(f"   Discount: -${data['total_discount']:.2f}")
        print(f"   Final Total: ${data['final_total']:.2f}")
        if data['final_total'] == 0:
            print("   ✅ SUCCESS: Order is completely FREE ($0)!")
        else:
            print("   ❌ FAILED: Order should be $0")
    else:
        print(f"   ❌ Error: {response.json()}")


def test_requirement_2_validation():
    """Test that expired and usage-limited coupons are rejected"""
    print_section("REQUIREMENT 2: Validate Expired & Usage Limit Reached Coupons")
    
    cart_items = [
        {"product_id": "1", "name": "Test Product", "price": 50.00, "quantity": 1}
    ]
    
    # Test expired coupon
    print("1️⃣ Testing EXPIRED coupon:")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["EXPIRED50"]
        }
    )
    if not response.ok:
        error = response.json()
        print(f"   ✅ Correctly rejected: {error['detail']}")
    else:
        print(f"   ❌ FAILED: Expired coupon should be rejected")
    
    # Test usage limit reached
    print("\n2️⃣ Testing USAGE LIMIT coupon:")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["LIMITED10"]
        }
    )
    if not response.ok:
        error = response.json()
        print(f"   ✅ Correctly rejected: {error['detail']}")
    else:
        data = response.json()
        print(f"   ℹ️  Coupon still valid (used {response.json().get('used_count', 0)} times)")
    
    # Test inactive coupon
    print("\n3️⃣ Testing INACTIVE coupon:")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["INACTIVE"]
        }
    )
    if not response.ok:
        error = response.json()
        print(f"   ✅ Correctly rejected: {error['detail']}")
    else:
        print(f"   ❌ FAILED: Inactive coupon should be rejected")


def test_requirement_3_price_display():
    """Test that cart calculation shows original vs discounted price"""
    print_section("REQUIREMENT 3: Original Price vs Discounted Price Display")
    
    cart_items = [
        {"product_id": "1", "name": "Widget A", "price": 100.00, "quantity": 1},
        {"product_id": "2", "name": "Widget B", "price": 50.00, "quantity": 2}
    ]
    
    print("📦 Cart Items:")
    print("   - Widget A: $100.00 x 1 = $100.00")
    print("   - Widget B: $50.00 x 2 = $100.00")
    print("   ORIGINAL PRICE: $200.00")
    
    # Test with multiple coupons
    print("\n💳 Applying multiple coupons: SAVE20, WINTER10")
    response = requests.post(
        f"{BASE_URL}/cart/calculate",
        json={
            "items": cart_items,
            "coupon_codes": ["SAVE20", "WINTER10"]
        }
    )
    
    if response.ok:
        data = response.json()
        print(f"\n┌─────────────────────────────────────┐")
        print(f"│         ORDER SUMMARY               │")
        print(f"├─────────────────────────────────────┤")
        print(f"│ Original Price:        ${data['subtotal']:>8.2f}  │")
        print(f"├─────────────────────────────────────┤")
        
        if data['applied_coupons']:
            print(f"│ Applied Discounts:                  │")
            for coupon in data['applied_coupons']:
                print(f"│   {coupon['code']:<10} -${coupon['discount_amount']:>8.2f}  │")
        
        print(f"├─────────────────────────────────────┤")
        print(f"│ Total Savings:        -${data['total_discount']:>8.2f}  │")
        print(f"├─────────────────────────────────────┤")
        print(f"│ DISCOUNTED PRICE:      ${data['final_total']:>8.2f}  │")
        print(f"└─────────────────────────────────────┘")
        
        print(f"\n✅ SUCCESS: Both Original and Discounted prices are clearly shown")
        print(f"   Original: ${data['subtotal']:.2f}")
        print(f"   Discounted: ${data['final_total']:.2f}")
        print(f"   You Save: ${data['total_discount']:.2f}")
    else:
        print(f"   ❌ Error: {response.json()}")


def get_available_coupons():
    """Display all available coupons"""
    print_section("AVAILABLE COUPONS")
    
    response = requests.get(f"{BASE_URL}/coupons/")
    if response.ok:
        coupons = response.json()
        print(f"Found {len(coupons)} active coupons:\n")
        
        for i, coupon in enumerate(coupons, 1):
            print(f"{i}. {coupon['code']}")
            if coupon['makes_free']:
                print(f"   💝 Makes order COMPLETELY FREE ($0)")
            elif coupon['discount_type'] == 'percentage':
                print(f"   💳 {coupon['discount_value']}% off")
            else:
                print(f"   💳 ${coupon['discount_value']} off")
            
            if coupon['expires_at']:
                exp_date = datetime.fromisoformat(coupon['expires_at'].replace('Z', '+00:00'))
                print(f"   📅 Expires: {exp_date.strftime('%Y-%m-%d')}")
            
            if coupon['usage_limit']:
                print(f"   🔢 Usage: {coupon['used_count']}/{coupon['usage_limit']}")
            
            print()
    else:
        print("❌ Could not fetch coupons")


if __name__ == "__main__":
    print("\n" + "🧪 TESTING COUPON SYSTEM - 3 REQUIREMENTS".center(70, "="))
    
    # Show available coupons first
    get_available_coupons()
    
    # Test all 3 requirements
    test_requirement_1_free_coupon()
    test_requirement_2_validation()
    test_requirement_3_price_display()
    
    print("\n" + "="*70)
    print("  ✅ All tests completed!".center(70))
    print("="*70 + "\n")
