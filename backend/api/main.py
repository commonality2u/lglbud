from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor.processor import PDFProcessor
from pdf_processor.models import ProcessingResult
import tempfile
import os
from typing import Optional
import aiofiles

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-pdf")
async def process_pdf(
    file: UploadFile = File(...),
    jwt_token: Optional[str] = None
) -> ProcessingResult:
    """
    Process a PDF file and extract scheduling information.
    
    Args:
        file: The PDF file to process
        jwt_token: Optional JWT token for authentication
        
    Returns:
        ProcessingResult containing extracted information or error details
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
        try:
            # Save uploaded file to temp location
            async with aiofiles.open(tmp_file.name, 'wb') as out_file:
                content = await file.read()
                await out_file.write(content)

            # Process the PDF
            processor = PDFProcessor()
            result = await processor.process_pdf(tmp_file.name)

            # If processing was successful and no review needed, store the document
            if result.success and not result.needs_review and result.data:
                stored = await processor.store_document(result.data)
                if not stored:
                    result.error = "Failed to store document in database"
                    result.success = False

            return result

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            # Clean up temporary file
            os.unlink(tmp_file.name)

@app.post("/api/confirm-processing")
async def confirm_processing(
    document_data: dict,
    jwt_token: Optional[str] = None
) -> bool:
    """
    Confirm and store processed document data after manual review.
    
    Args:
        document_data: The reviewed and potentially modified document data
        jwt_token: Optional JWT token for authentication
        
    Returns:
        Boolean indicating success or failure
    """
    try:
        processor = PDFProcessor()
        return await processor.store_document(document_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 