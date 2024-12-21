from supabase import create_client, Client
from dotenv import load_dotenv
import os
from typing import Optional, Any, Dict
from app.config import settings

# Load environment variables
load_dotenv()

class SupabaseHandler:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
        self.client: Client = create_client(self.url, self.key)

    async def table(self, table_name: str):
        """Get a table reference."""
        return self.client.table(table_name)

    async def store_document(self, document_data: dict) -> bool:
        """Store document data in Supabase."""
        try:
            result = await self.client.table("documents").insert(document_data).execute()
            return bool(result.data)
        except Exception as e:
            print(f"Error storing document: {e}")
            return False

    async def update_document_status(self, document_id: str, status: str, error_message: str = None) -> bool:
        """Update document status in Supabase."""
        try:
            update_data = {
                "status": status,
                "error_message": error_message if error_message else None
            }
            result = await self.client.table("documents").update(update_data).eq("id", document_id).execute()
            return bool(result.data)
        except Exception as e:
            print(f"Error updating document status: {e}")
            return False

    async def check_document_exists(self, file_hash: str) -> bool:
        """Check if a document with the given hash exists."""
        try:
            result = await self.client.table("scheduling_orders").select("*").eq("file_hash", file_hash).execute()
            return bool(result.data)
        except Exception as e:
            print(f"Error checking document existence: {e}")
            return False

    async def store_scheduling_order(self, document_data: Dict[str, Any], deadlines: list) -> bool:
        """Store scheduling order and its deadlines."""
        try:
            # Store the document
            result = await self.client.table("scheduling_orders").insert(document_data).execute()
            if not result.data:
                return False
            
            doc_id = result.data[0]['id']
            
            # Store the deadlines
            deadline_data = [
                {**d, 'scheduling_order_id': doc_id}
                for d in deadlines
            ]
            await self.client.table("calendar_deadlines").insert(deadline_data).execute()
            
            return True
        except Exception as e:
            print(f"Error storing scheduling order: {e}")
            return False 