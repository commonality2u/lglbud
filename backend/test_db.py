from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize the Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def test_connection():
    try:
        # Test query to documents table
        response = supabase.table('documents').select("*").limit(1).execute()
        print("Connection successful!")
        print("Documents table exists and is accessible")
        print(f"Response: {response}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_storage():
    try:
        # Test storage bucket
        bucket_info = supabase.storage.get_bucket('documents')
        print("Storage bucket 'documents' exists and is accessible")
        print(f"Bucket info: {bucket_info}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Supabase setup...")
    print(f"Using Supabase URL: {os.getenv('SUPABASE_URL')}")
    test_connection()
    test_storage() 