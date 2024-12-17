import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

import pdfplumber
import spacy
import dateparser
import re
from supabase import create_client, Client
from dotenv import load_dotenv
import os

from .models import (
    ProcessingResult,
    ExtractedDocument,
    Deadline,
    DeadlineCategory,
    DocumentType
)

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", "")
)

# Load SpaCy model for NER
nlp = spacy.load("en_core_legal_sm")  # You'll need to train this on legal documents

class PDFProcessor:
    def __init__(self):
        self.date_patterns = [
            r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b',
            r'\b\d{1,2}/\d{1,2}/\d{4}\b',
            r'\b\d{4}-\d{2}-\d{2}\b'
        ]
        self.case_number_pattern = r'Case\s+No\.?\s*([\w\-:]+)'
        self.deadline_keywords = {
            DeadlineCategory.DISCOVERY: [
                "discovery", "disclosure", "production", "interrogatories",
                "deposition", "request for production"
            ],
            DeadlineCategory.MOTION: [
                "motion", "response", "reply", "brief", "memorandum"
            ],
            DeadlineCategory.TRIAL: [
                "trial", "jury selection", "verdict"
            ],
            DeadlineCategory.PRETRIAL: [
                "pretrial", "pre-trial", "settlement conference"
            ],
            DeadlineCategory.HEARING: [
                "hearing", "oral argument", "status conference"
            ],
            DeadlineCategory.CONFERENCE: [
                "conference", "meeting", "consultation"
            ]
        }

    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def extract_dates(self, text: str) -> Dict[str, datetime]:
        """Extract dates with context from text."""
        dates = {}
        for pattern in self.date_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                date_str = match.group(0)
                parsed_date = dateparser.parse(date_str)
                if parsed_date:
                    # Get context (50 chars before and after)
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end]
                    dates[context] = parsed_date
        return dates

    def categorize_deadline(self, context: str) -> DeadlineCategory:
        """Categorize deadline based on context."""
        context = context.lower()
        for category, keywords in self.deadline_keywords.items():
            if any(keyword in context for keyword in keywords):
                return category
        return DeadlineCategory.OTHER

    def extract_case_info(self, text: str) -> Dict[str, Any]:
        """Extract case number and other metadata."""
        doc = nlp(text)
        info = {
            "case_number": None,
            "court_name": None,
            "judge_name": None
        }

        # Extract case number
        case_match = re.search(self.case_number_pattern, text)
        if case_match:
            info["case_number"] = case_match.group(1)

        # Extract court and judge using SpaCy NER
        for ent in doc.ents:
            if ent.label_ == "COURT":
                info["court_name"] = ent.text
            elif ent.label_ == "JUDGE":
                info["judge_name"] = ent.text

        return info

    def determine_document_type(self, text: str) -> DocumentType:
        """Determine if this is an original or amended scheduling order."""
        if re.search(r'amended|modified|revised', text.lower()):
            return DocumentType.AMENDED_SCHEDULING_ORDER
        return DocumentType.SCHEDULING_ORDER

    async def process_pdf(self, file_path: str) -> ProcessingResult:
        """Process PDF and extract relevant information."""
        try:
            # Calculate file hash
            file_hash = self.calculate_file_hash(file_path)

            # Check if this file has been processed before
            existing_doc = await supabase.table("scheduling_orders").select("*").eq("file_hash", file_hash).execute()
            if existing_doc.data:
                return ProcessingResult(
                    success=False,
                    error="This document has already been processed",
                    needs_review=False
                )

            extracted_text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted_text += page.extract_text() + "\n"

            # Extract basic information
            case_info = self.extract_case_info(extracted_text)
            if not case_info["case_number"]:
                return ProcessingResult(
                    success=False,
                    error="Could not extract case number",
                    needs_review=True
                )

            # Extract dates and create deadlines
            dates = self.extract_dates(extracted_text)
            deadlines = []
            for context, date in dates.items():
                category = self.categorize_deadline(context)
                confidence = 0.9 if category != DeadlineCategory.OTHER else 0.7

                deadline = Deadline(
                    title=context.strip(),
                    due_date=date,
                    category=category,
                    confidence_score=confidence,
                    description=context
                )
                deadlines.append(deadline)

            # Create extracted document
            document = ExtractedDocument(
                case_number=case_info["case_number"],
                document_type=self.determine_document_type(extracted_text),
                court_name=case_info["court_name"],
                judge_name=case_info["judge_name"],
                deadlines=deadlines,
                original_filename=Path(file_path).name,
                file_hash=file_hash
            )

            # Determine if manual review is needed
            needs_review = any(d.confidence_score < 0.8 for d in deadlines)

            return ProcessingResult(
                success=True,
                data=document,
                needs_review=needs_review
            )

        except Exception as e:
            return ProcessingResult(
                success=False,
                error=str(e),
                needs_review=True
            )

    async def store_document(self, document: ExtractedDocument) -> bool:
        """Store extracted document in Supabase."""
        try:
            # Insert document
            doc_data = document.dict()
            doc_data.pop('deadlines')  # Handle deadlines separately
            
            result = await supabase.table("scheduling_orders").insert(doc_data).execute()
            doc_id = result.data[0]['id']

            # Insert deadlines
            deadline_data = [
                {**d.dict(), 'scheduling_order_id': doc_id}
                for d in document.deadlines
            ]
            await supabase.table("calendar_deadlines").insert(deadline_data).execute()

            return True
        except Exception as e:
            print(f"Error storing document: {e}")
            return False 