"""Add server column to users table"""
import asyncio
import asyncpg
from app.config import get_settings

async def add_server_column():
    """Add server column to users table"""
    settings = get_settings()
    # Remove +asyncpg from the URL for asyncpg.connect
    db_url = settings.DATABASE_URL.replace('postgresql+asyncpg://', 'postgresql://')
    conn = await asyncpg.connect(db_url)
    
    try:
        # Check if column already exists
        check_query = """
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name='server'
        """
        result = await conn.fetch(check_query)
        
        if result:
            print("✓ Server column already exists")
            return
        
        # Add server column
        await conn.execute("""
            ALTER TABLE users 
            ADD COLUMN server VARCHAR(255)
        """)
        
        print("✓ Successfully added server column to users table")
        
    except Exception as e:
        print(f"✗ Error adding server column: {e}")
        raise
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(add_server_column())
