import os
import asyncio
import subprocess
import json
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, UploadFile, Form, HTTPException, BackgroundTasks
from starlette.responses import JSONResponse
from supabase import Client, create_client

from ...config import settings

router = APIRouter()

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    uploadType: str = Form(...),
    caseNumber: str = Form(...),
):
    try:
        document_id = str(uuid4())
        storage_path = f"{uploadType}/{caseNumber}/{document_id}_{file.filename}"

        async def upload_file_in_chunks(file: UploadFile, storage_path: str):
            CHUNK_SIZE = 1024 * 1024 * 5  # 5MB chunks
            with open(file.filename, "wb") as temp_file:  # Create a temporary file
                while True:
                    chunk = await file.read(CHUNK_SIZE)
                    if not chunk:
                        break
                    temp_file.write(chunk)
            with open(file.filename, "rb") as temp_file:
                res = supabase.storage.from_("documents").upload(storage_path, temp_file)
            os.remove(file.filename) # Remove the temporary file
            return res

        try:
            res = await upload_file_in_chunks(file, storage_path)
            if not res:
                raise HTTPException(status_code=500, detail="Failed to upload to storage")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Supabase storage upload failed: {e}")

        file_url = supabase.storage.from_("documents").get_public_url(storage_path)

        # Get file size
        file_size = os.path.getsize(file.filename) if os.path.exists(file.filename) else 0

        document_data = {
            "id": document_id,
            "title": file.filename,
            "type": uploadType,
            "case_number": caseNumber,
            "storage_path": storage_path,
            "url": file_url,
            "status": "pending",
            "size": file_size,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

        try:
            res = supabase.table("documents").insert(document_data).execute()
            if not res.data:
                raise HTTPException(status_code=500, detail="Failed to create database record")
        except Exception as e:
            # If database insert fails, try to clean up the uploaded file
            try:
                supabase.storage.from_("documents").remove(storage_path)
            except:
                pass  # Ignore cleanup errors
            raise HTTPException(status_code=500, detail=f"Supabase database insert failed: {e}")

        # Add background task for processing
        background_tasks.add_task(process_document, document_id, uploadType, caseNumber, storage_path)

        return JSONResponse(
            content={
                "success": True,
                "message": f"File '{file.filename}' uploaded successfully and processing has started",
                "document": {
                    "id": document_id,
                    "title": file.filename,
                    "type": uploadType,
                    "case_number": caseNumber,
                    "status": "pending",
                    "size": file_size,
                    "url": file_url,
                    "created_at": document_data["created_at"]
                }
            },
            status_code=202
        )

    except Exception as e:
        # If any error occurs, try to clean up any uploaded file
        try:
            if 'storage_path' in locals():
                supabase.storage.from_("documents").remove(storage_path)
        except:
            pass  # Ignore cleanup errors
        
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": f"Upload failed: {str(e)}",
                "error": str(e)
            }
        )


async def process_document(document_id: str, uploadType: str, caseNumber: str, storage_path: str):
    try:
        # Update status to processing
        supabase.table("documents").update({
            "status": "processing",
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", document_id).execute()

        # Download the file from Supabase storage
        file_content = supabase.storage.from_("documents").download(storage_path)
        
        # Process the document based on type
        # ... (implement your processing logic here)
        
        # For demonstration, we'll just update the status to processed
        supabase.table("documents").update({
            "status": "processed",
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", document_id).execute()

    except Exception as e:
        error_message = str(e)
        print(f"Error processing document {document_id}: {error_message}")
        
        try:
            # Update document status to error
            supabase.table("documents").update({
                "status": "error",
                "error_message": error_message,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", document_id).execute()
        except Exception as update_error:
            print(f"Failed to update error status for document {document_id}: {update_error}")