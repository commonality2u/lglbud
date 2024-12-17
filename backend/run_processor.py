import asyncio
import os
from pdf_processor.process_pdfs import main
from dotenv import load_dotenv

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Verify environment variables
    required_vars = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY"
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        exit(1)
    
    # Run the processor
    print("Starting PDF processor...")
    asyncio.run(main()) 