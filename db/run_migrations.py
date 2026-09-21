import os
import sys
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

def get_db_connection():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    load_dotenv(os.path.join(root_dir, ".env"))
    load_dotenv()
    
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Error: DATABASE_URL or SUPABASE_DB_URL environment variable not found.")
        print("Please set it in your .env file or export it in your shell.")
        sys.exit(1)
        
    try:
        # Connect using the DSN
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        return conn
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        sys.exit(1)

def run_migrations():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    migrations_dir = os.path.dirname(os.path.abspath(__file__))
    migrations_dir = os.path.join(migrations_dir, "migrations")
    
    # Create migrations table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Get all migration files
    migration_files = sorted([f for f in os.listdir(migrations_dir) if f.endswith(".sql")])
    
    for filename in migration_files:
        version = filename.split("_")[0]
        
        # Check if already applied
        cursor.execute("SELECT version FROM schema_migrations WHERE version = %s", (version,))
        if cursor.fetchone():
            print(f"Skipping {filename} - already applied.")
            continue
            
        print(f"Applying {filename}...")
        filepath = os.path.join(migrations_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            sql = f.read()
            
        try:
            cursor.execute(sql)
            cursor.execute("INSERT INTO schema_migrations (version) VALUES (%s)", (version,))
            print(f"Successfully applied {filename}.")
        except Exception as e:
            print(f"Error applying {filename}: {e}")
            conn.rollback()
            sys.exit(1)
            
    print("All migrations completed successfully.")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    run_migrations()
