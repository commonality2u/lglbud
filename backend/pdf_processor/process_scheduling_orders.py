import os
from pathlib import Path
from typing import List
from processor import PDFProcessor
from models import ProcessingResult
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def process_directory(directory: str) -> List[ProcessingResult]:
    """Process all PDFs in the directory."""
    processor = PDFProcessor()
    results = []
    
    # Get all PDF files
    pdf_files = list(Path(directory).glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF files to process")
    
    for pdf_path in pdf_files:
        print(f"\nProcessing {pdf_path.name}...")
        try:
            # Process the PDF
            result = await processor.process_pdf(str(pdf_path))
            
            if result.success:
                if result.needs_review:
                    print(f"⚠️  {pdf_path.name} needs review:")
                    if result.data:
                        print(f"  - Case Number: {result.data.case_number}")
                        print(f"  - Document Type: {result.data.document_type}")
                        print(f"  - Number of deadlines: {len(result.data.deadlines)}")
                        print("\nDeadlines that need review:")
                        for deadline in result.data.deadlines:
                            if deadline.confidence_score < 0.8:
                                print(f"  - {deadline.title}: {deadline.due_date} (Confidence: {deadline.confidence_score:.2f})")
                else:
                    print(f"✅ Successfully processed {pdf_path.name}")
                    if result.data:
                        # Store in Supabase
                        stored = await processor.store_document(result.data)
                        if stored:
                            print(f"  ✅ Stored in Supabase")
                        else:
                            print(f"  ❌ Failed to store in Supabase")
            else:
                print(f"❌ Failed to process {pdf_path.name}: {result.error}")
            
            results.append(result)
            
        except Exception as e:
            print(f"❌ Error processing {pdf_path.name}: {str(e)}")
    
    return results

async def main():
    # Directory containing scheduling orders
    directory = "test/scheduling-orders"
    
    # Process all PDFs
    results = await process_directory(directory)
    
    # Print summary
    total = len(results)
    successful = sum(1 for r in results if r.success)
    needs_review = sum(1 for r in results if r.success and r.needs_review)
    failed = sum(1 for r in results if not r.success)
    
    print("\n=== Processing Summary ===")
    print(f"Total PDFs processed: {total}")
    print(f"Successfully processed: {successful}")
    print(f"Needs review: {needs_review}")
    print(f"Failed: {failed}")

if __name__ == "__main__":
    asyncio.run(main()) 