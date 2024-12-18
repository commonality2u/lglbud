from supabase import create_client
import os
from dotenv import load_dotenv
import requests
import mimetypes

load_dotenv()

# Initialize the Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def test_upload():
    # Create a test text file
    test_file_path = "test_document.txt"
    with open(test_file_path, "w") as f:
        f.write("This is a test document for upload testing.")

    try:
        # Prepare the upload
        files = {
            'file': ('test_document.txt', open(test_file_path, 'rb'), 'text/plain')
        }
        data = {
            'uploadType': 'text_message',
            'caseNumber': 'TEST-001'
        }

        # Make the upload request
        response = requests.post(
            'http://localhost:8000/api/upload',
            files=files,
            data=data
        )

        print(f"Upload Response Status: {response.status_code}")
        print(f"Upload Response: {response.json()}")

        # Verify the file exists in Supabase storage
        storage_path = f"text_message/TEST-001/test_document.txt"
        try:
            file_info = supabase.storage.from_("documents").get_public_url(storage_path)
            print(f"File successfully stored in Supabase: {file_info}")
        except Exception as e:
            print(f"Error verifying file in storage: {str(e)}")

        # Verify database entry
        try:
            db_response = supabase.table('documents').select("*").eq('storage_path', storage_path).execute()
            print(f"Database entry: {db_response.data}")
        except Exception as e:
            print(f"Error verifying database entry: {str(e)}")

    except Exception as e:
        print(f"Error during upload test: {str(e)}")
    finally:
        # Cleanup
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

if __name__ == "__main__":
    print("Testing upload functionality...")
    test_upload() 