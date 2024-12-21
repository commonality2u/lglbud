import psycopg2
from psycopg2.pool import SimpleConnectionPool
from dotenv import load_dotenv
import os
from contextlib import contextmanager
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

def get_db_config():
    """Parse database URL and return config dict"""
    # Check if we're running in Docker
    is_docker = os.getenv("DOCKER_ENV", "false").lower() == "true"
    
    # Use localhost for local development, postgres_db for Docker
    default_host = "postgres_db" if is_docker else "localhost"
    database_url = os.getenv("DATABASE_URL", f"postgresql://postgres:postgres123@{default_host}:5432/postgres")
    
    try:
        # Parse the URL
        parsed = urlparse(database_url)
        
        # Split userpass and hostport
        userpass, hostport = parsed.netloc.split("@", 1)
        user, password = userpass.split(":", 1)
        host, port = hostport.split(":", 1)
        
        # Override host with localhost for local development
        if not is_docker and host == "postgres_db":
            host = "localhost"
        
        return {
            "dbname": parsed.path.lstrip('/'),
            "user": user,
            "password": password,
            "host": host,
            "port": port
        }
    except Exception as e:
        print(f"Error parsing DATABASE_URL: {e}")
        # Fallback to default local config
        return {
            "dbname": "postgres",
            "user": "postgres",
            "password": "postgres123",
            "host": "localhost" if not is_docker else "postgres_db",
            "port": "5432"
        }

# Get database configuration
DB_CONFIG = get_db_config()
print(f"Connecting to database at: {DB_CONFIG['host']}:{DB_CONFIG['port']}")

# Create a connection pool
pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    **DB_CONFIG
)

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)

@contextmanager
def get_db_cursor(commit=False):
    """Context manager for database cursors"""
    with get_db_connection() as connection:
        cursor = connection.cursor()
        try:
            yield cursor
            if commit:
                connection.commit()
        finally:
            cursor.close()

def test_connection():
    """Test the database connection"""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT NOW();")
            result = cursor.fetchone()
            print("Database connection successful! Current time:", result[0])
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False 