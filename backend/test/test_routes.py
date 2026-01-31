"""Test cart route"""
from app.main import app
import sys

print("\n=== Checking Registered Routes ===\n")
cart_routes = []
for route in app.routes:
    if hasattr(route, 'path'):
        path = route.path
        if 'cart' in path.lower():
            methods = list(route.methods) if hasattr(route, 'methods') else []
            cart_routes.append((path, methods))
            print(f"✅ Found: {path} - {methods}")

if not cart_routes:
    print("❌ NO CART ROUTES FOUND!")
    print("\nAll routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"  - {route.path}")
else:
    print(f"\n✅ Found {len(cart_routes)} cart route(s)")
