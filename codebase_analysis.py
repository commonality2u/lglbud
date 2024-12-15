from dotenv import load_dotenv
import anthropic
import json
import os
import pathlib
import time
import logging
from tqdm import tqdm
from colorama import Fore, Style, init
import asyncio
import aiohttp
from datetime import datetime
import random
import ast
import re
from pathlib import Path
from typing import Dict, List, Set
import subprocess
import sys

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
API_KEY = os.getenv("ANTHROPIC_API_KEY")  # Get from environment variable
MODEL_NAME = "claude-3-5-sonnet-20241022"
PLAN_FILE = ".cursorrules"
CODEBASE_ROOT = os.path.dirname(os.path.abspath(__file__))

# Create output directory
OUTPUT_DIR = "analysis_output"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "codebase_analysis.json")
PROGRESS_FILE = os.path.join(OUTPUT_DIR, "analysis_progress.json")
LOG_FILE = os.path.join(OUTPUT_DIR, "codebase_analysis.log")

# Increase the recursion limit
sys.setrecursionlimit(10000)

# --- Initialize colorama ---
init(autoreset=True)

# --- Configure logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class RateLimit:
    """Rate limiter optimized for Claude 3.5 Sonnet's context window and rate limits"""
    def __init__(self):
        self.requests = []
        self.lock = asyncio.Lock()
        self.base_delay = 2  # Reduced base delay between requests
        self.concurrent_limit = 4  # Allow 4 concurrent requests
        self.semaphore = asyncio.Semaphore(self.concurrent_limit)
        
    async def acquire(self):
        async with self.lock:
            now = time.time()
            self.requests = [req_time for req_time in self.requests if now - req_time < 60]
            
            if len(self.requests) >= self.concurrent_limit:
                time_since_oldest = now - self.requests[-self.concurrent_limit]
                if time_since_oldest < self.base_delay:
                    await asyncio.sleep(self.base_delay - time_since_oldest)
            
            self.requests.append(time.time())
            return True

def load_plan(filepath):
    """Loads the plan from the .cursorrules file."""
    try:
        if not os.path.exists(filepath):
            logging.error(f"Plan file {filepath} not found.")
            return None

        # Try different encodings
        encodings = ['utf-8', 'utf-8-sig', 'latin-1']
        
        for encoding in encodings:
            try:
                with open(filepath, "r", encoding=encoding) as f:
                    cursorrules_content = f.read()

                if not cursorrules_content.strip():
                    logging.error("Plan file is empty.")
                    return None

                logging.info(f"Successfully loaded plan from {filepath} using {encoding} encoding")
                return cursorrules_content.strip()
                
            except UnicodeDecodeError:
                continue
            
        # If we get here, none of the encodings worked
        logging.error(f"Failed to decode {filepath} with any of the attempted encodings")
        return None

    except Exception as e:
        logging.error(f"Error loading plan from {filepath}: {e}")
        return None

def get_code_files(root_dir):
    """Recursively retrieves only new unprocessed code files."""
    # Load existing processed files
    progress_data = load_progress()
    processed_files = set(progress_data['processed_files'])
    
    # Define directories to ignore
    IGNORED_DIRS = {
        '.next',
        'node_modules',
        '__pycache__',
        '.git',
        'dist',
        'build',
        '.turbo',
        '.vercel',
        '.cache',
        '.husky',
        'coverage',
        '.npm',
        'package-lock.json',
        'yarn.lock',
        'venv',
        'env',
        '.env',
        '.venv',
        '*.pyc',
        '.idea'
    }
    
    # Define file extensions to analyze
    CODE_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.sql'}
    
    # Use absolute path for legal-buddy directory
    legal_buddy_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    code_files = []
    
    print("\nScanning for new files...")

    for path in pathlib.Path(legal_buddy_dir).rglob("*.*"):
        file_path = str(path)
        
        # Skip if already processed
        if file_path in processed_files:
            continue
            
        # Skip ignored directories
        if any(ignored in path.parts for ignored in IGNORED_DIRS):
            continue
            
        # Only include specified file extensions
        if path.suffix in CODE_EXTENSIONS:
            code_files.append(str(path))
            print(f"Found new file: {str(path)}")

    print(f"\nTotal new files found: {len(code_files)}")
            
    return code_files

def load_progress():
    """Load progress from previous run if it exists."""
    try:
        if os.path.exists(PROGRESS_FILE):
            with open(PROGRESS_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
        logging.info("No previous progress found, starting fresh")
    except Exception as e:
        logging.warning(f"Could not load progress file: {e}")
    return {'processed_files': [], 'failed_files': []}

def save_progress(processed_files, failed_files):
    """Save current progress to file."""
    try:
        with open(PROGRESS_FILE, 'w') as f:
            json.dump({
                'processed_files': processed_files,
                'failed_files': failed_files,
                'timestamp': datetime.now().isoformat()
            }, f)
    except Exception as e:
        logging.error(f"Error saving progress: {e}")

def analyze_imports(filepath: str) -> dict:
    """Analyze imports and return information about dependencies and potential issues."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Track different types of imports
        analysis = {
            'npm_packages': set(),  # For package.json dependencies
            'python_packages': set(),  # For requirements.txt
            'local_imports': [],  # Project files being imported
            'import_errors': []  # Issues with imports
        }
        
        # Check for Node.js/TypeScript imports
        if filepath.endswith(('.js', '.jsx', '.ts', '.tsx')):
            # Match import statements
            import_lines = re.findall(r'(?:import|require)\s*[\({]?\s*["\']([^"\']+)["\']', content)
            for imp in import_lines:
                if imp.startswith('.'):
                    # Local import - verify file exists
                    import_path = os.path.normpath(os.path.join(os.path.dirname(filepath), imp))
                    if not os.path.exists(f"{import_path}.ts") and not os.path.exists(f"{import_path}.tsx") \
                       and not os.path.exists(f"{import_path}.js") and not os.path.exists(f"{import_path}.jsx"):
                        analysis['import_errors'].append(f"Missing local import: {imp}")
                    else:
                        analysis['local_imports'].append(imp)
                elif imp.startswith('@/'):
                    # Project alias import - verify in src directory
                    alias_path = imp.replace('@/', 'src/')
                    if not os.path.exists(os.path.join(CODEBASE_ROOT, f"{alias_path}.ts")) and \
                       not os.path.exists(os.path.join(CODEBASE_ROOT, f"{alias_path}.tsx")):
                        analysis['import_errors'].append(f"Invalid alias import: {imp}")
                    else:
                        analysis['local_imports'].append(imp)
                else:
                    # NPM package
                    package_name = imp.split('/')[0]
                    analysis['npm_packages'].add(package_name)
                    
        # Check for Python imports
        elif filepath.endswith('.py'):
            # Match import statements
            import_lines = re.findall(r'^(?:import|from)\s+([^\s]+)', content, re.MULTILINE)
            for imp in import_lines:
                if imp.startswith('.'):
                    # Local import - verify file exists
                    import_path = os.path.normpath(os.path.join(os.path.dirname(filepath), imp.lstrip('.').replace('.', '/')))
                    if not os.path.exists(f"{import_path}.py"):
                        analysis['import_errors'].append(f"Missing local import: {imp}")
                    else:
                        analysis['local_imports'].append(imp)
                else:
                    # Python package
                    package_name = imp.split('.')[0]
                    if package_name not in {'os', 'sys', 're', 'json', 'time', 'datetime', 'pathlib', 'typing'}:
                        analysis['python_packages'].add(package_name)
        
        # Convert sets to lists for JSON serialization
        analysis['npm_packages'] = list(analysis['npm_packages'])
        analysis['python_packages'] = list(analysis['python_packages'])
        
        return analysis
        
    except Exception as e:
        logging.error(f"Error analyzing imports in {filepath}: {e}")
        return {
            'npm_packages': [],
            'python_packages': [],
            'local_imports': [],
            'import_errors': [f"Error analyzing imports: {str(e)}"]
        }

def generate_dependency_summary(analyses) -> dict:
    """Generate a summary of all required dependencies from analyses."""
    summary = {
        'npm_packages': set(),
        'python_packages': set(),
        'import_errors': [],
        'local_import_errors': []
    }
    
    for analysis in analyses:
        if 'imports' in analysis:
            imp_analysis = analysis['imports']
            summary['npm_packages'].update(imp_analysis.get('npm_packages', []))
            summary['python_packages'].update(imp_analysis.get('python_packages', []))
            if imp_analysis.get('import_errors'):
                summary['import_errors'].extend([
                    f"{analysis['filepath']}: {error}"
                    for error in imp_analysis['import_errors']
                ])
    
    return {
        'npm_packages': sorted(list(summary['npm_packages'])),
        'python_packages': sorted(list(summary['python_packages'])),
        'import_errors': sorted(summary['import_errors'])
    }

async def analyze_file_with_claude(filepath: str, plan_data: str, client, rate_limiter):
    """Analyze a file using Claude API and return structured analysis."""
    try:
        # Read file contents
        with open(filepath, "r", encoding='utf-8') as f:
            code = f.read()
        
        # Analyze imports first
        import_analysis = analyze_imports(filepath)
        
        await rate_limiter.acquire()
        
        # Make API call with system message as top-level parameter
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            system="You are an expert software engineer analyzing code implementation against requirements. Analyze the code and return a detailed analysis of implemented features, missing requirements, and suggestions for improvement.",
            messages=[
                {
                    "role": "user",
                    "content": f"""Analyze this file against the planned requirements:

                    File: {filepath}
                    
                    Planned Requirements:
                    ```
                    {plan_data}
                    ```
                    
                    Implementation:
                    ```
                    {code}
                    ```

                    Return the analysis as a JSON object with this EXACT structure:
                    {{
                        "filepath": "{filepath}",
                        "analysis": {{
                            "implemented": [
                                {{
                                    "requirement": "string",
                                    "status": "Fully Implemented | Partially Implemented",
                                    "details": "string"
                                }}
                            ],
                            "missing": [
                                {{
                                    "requirement": "string",
                                    "priority": "High | Medium | Low",
                                    "details": "string"
                                }}
                            ],
                            "suggestions": [
                                {{
                                    "type": "Addition | Improvement",
                                    "description": "string"
                                }}
                            ]
                        }},
                        "validation": {{
                            "issues": ["string"],
                            "suggestions": [
                                {{
                                    "type": "Organization",
                                    "description": "string"
                                }}
                            ]
                        }}
                    }}

                    Focus on:
                    1. Actual implemented features vs requirements
                    2. Missing critical functionality
                    3. Code organization and structure
                    4. Potential improvements and suggestions
                    5. Validation issues (TypeScript, ESLint, etc.)
                    """
                }
            ]
        )

        try:
            content = response.content[0].text
            # Remove control characters and find JSON
            cleaned_content = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', content)
            json_match = re.search(r'\{[\s\S]*\}', cleaned_content)
            if json_match:
                analysis_result = json.loads(json_match.group(0))
                # Add import analysis to the result
                analysis_result['imports'] = import_analysis
                return analysis_result
            else:
                raise ValueError("No JSON object found in response")
                
        except (json.JSONDecodeError, ValueError) as e:
            logging.error(f"Failed to parse JSON response for {filepath}: {str(e)}")
            logging.debug(f"Raw response content: {content}")
            return None

    except Exception as e:
        logging.error(f"Error analyzing {filepath}: {str(e)}")
        return None

async def save_analysis_results(analyses, output_file):
    """Save analysis results to file, creating a new file if it doesn't exist."""
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analyses, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logging.error(f"Error saving analysis results: {e}")

def generate_directory_tree(root_dir: str) -> str:
    """Generate a formatted directory tree structure with descriptions."""
    tree = ["Legal Buddy Web App"]
    
    # Common descriptions for files and folders
    DESCRIPTIONS = {
        # Folders
        ".vscode": "Contains the file extensions.json.",
        "analysis_output": "Contains the analysis output files.",
        "public": "Static assets directory containing SVG files and other public resources.",
        "src": "Source code directory containing all application code.",
        "app": "Next.js App Router directory containing pages and API routes.",
        "components": "Reusable React components directory.",
        # Files
        ".cursorrules": "Summary: Contains the UI/UX plan, app structure, file descriptions, and API routes.",
        ".env": "Contains the ANTHROPIC_API_KEY necessary for authenticating with the specific API.",
        ".env.local": "Contains environment variables including NEXT_PUBLIC_SUPABASE_URL and credentials.",
        ".gitignore": "File containing rules for ignoring specific files and directories in the project repository.",
        "app-structure.txt": "This file contains a listing of the folder path with various files and subdirectories.",
        "codebase_analysis.py": "This file performs code analysis, including checking for validation issues and analyzing imports.",
        "components.json": "Config file specifying UI schema, including Tailwind CSS configurations and aliases.",
        "eslint.config.mjs": "Configures ESLint rules for the project based on Next.js and TypeScript conventions.",
        "next-env.d.ts": "Type definitions for Next.js, including references to necessary global image types.",
        "next.config.js": "Configuration settings for a Next.js project, enabling react strict mode and SWC minification.",
        "package.json": "Defines project details, including scripts, dependencies, and devDependencies.",
        "postcss.config.js": "Configuration file for PostCSS with plugins for Tailwind CSS and Autoprefixer.",
        "postcss.config.mjs": "Configuration file for PostCSS, defining plugins including Tailwind CSS.",
        "README.md": "README.md: Contains information about a Next.js project, including setup instructions.",
    }
    
    IGNORED_DIRS = {
        '.git', 'node_modules', '.next', '__pycache__', '.vscode',
        '.idea', 'dist', 'build', 'coverage', '.turbo',
        '.vercel', '.cache', '.husky', '.github'
    }
    
    def add_to_tree(path: Path, prefix: str = "", is_last: bool = True):
        """Recursively build tree structure with descriptions."""
        if any(ignored in str(path) for ignored in IGNORED_DIRS):
            return
            
        if path.name.startswith('.') and path.name not in {'.env', '.env.local', '.cursorrules'}:
            return
            
        icon = "📁 " if path.is_dir() else "📄 "
        connector = "└── " if is_last else "├── "
        
        # Get description or use a default
        description = DESCRIPTIONS.get(path.name, "")
        description_text = f" # {description}" if description else ""
        
        # Add path to tree with description
        tree.append(f"{prefix}{connector}{icon}{path.name}{description_text}")
        
        if path.is_dir():
            items = sorted(list(path.iterdir()), key=lambda x: (not x.is_dir(), x.name))
            for i, item in enumerate(items):
                is_last_item = i == len(items) - 1
                new_prefix = prefix + ("    " if is_last else "│   ")
                add_to_tree(item, new_prefix, is_last_item)
    
    root = Path(root_dir)
    add_to_tree(root)
    
    tree.extend([
        "",
        "Legend:",
        "📁 Directory",
        "📄 File"
    ])
    
    return "\n".join(tree)

async def main():
    """Main execution function."""
    # Initialize these at the start to avoid UnboundLocalError
    processed_files = set()
    failed_files = set()
    analyses = []
    
    try:
        # Load existing analyses if any
        existing_analyses = []
        if os.path.exists(OUTPUT_FILE):
            try:
                with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                    existing_analyses = json.load(f)
            except json.JSONDecodeError:
                logging.warning("Could not load existing analyses, starting fresh")

        # Generate and save the directory tree first
        tree_output = generate_directory_tree(CODEBASE_ROOT)
        tree_output_file = os.path.join(OUTPUT_DIR, "app_structure.md")
        
        print(f"\nGenerating App Structure...")
        with open(tree_output_file, "w", encoding="utf-8") as f:
            f.write("# Legal Buddy Web App Structure\n\n")
            f.write("```\n")
            f.write(tree_output)
            f.write("\n```\n")
        print(f"App structure saved to {tree_output_file}\n")

        client = anthropic.AsyncAnthropic(api_key=API_KEY)
        rate_limiter = RateLimit()

        # Load progress and existing analyses
        progress_data = load_progress()
        processed_files = set(progress_data['processed_files'])
        failed_files = set(progress_data['failed_files'])
        
        # Load existing analyses if any
        if os.path.exists(OUTPUT_FILE):
            try:
                with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                    analyses = json.load(f)
            except json.JSONDecodeError:
                analyses = []

        # Load plan
        plan_data = load_plan(PLAN_FILE)
        if not plan_data:
            print(f"Error loading plan. Exiting.")
            return

        # Get code files
        code_files = get_code_files(CODEBASE_ROOT)
        print(f"Found {len(code_files)} files to analyze...")

        # Process files
        remaining_files = [f for f in code_files if f not in processed_files]
        
        with tqdm(total=len(remaining_files), desc="Analyzing files") as pbar:
            for filepath in remaining_files:
                result = await analyze_file_with_claude(
                    filepath=filepath,
                    plan_data=plan_data,
                    client=client,
                    rate_limiter=rate_limiter
                )
                if result:
                    analyses.append(result)
                    processed_files.add(filepath)
                    # Save results after each successful analysis
                    await save_analysis_results(analyses, OUTPUT_FILE)
                else:
                    failed_files.add(filepath)
                pbar.update(1)
                
                # Save progress after each file
                save_progress(list(processed_files), list(failed_files))

        # Generate and append dependency summary to app structure
        dependency_summary = generate_dependency_summary(analyses)
        with open(tree_output_file, 'a', encoding='utf-8') as f:
            f.write("\n\n## Dependencies\n")
            f.write("\n### NPM Packages Required\n")
            for pkg in dependency_summary['npm_packages']:
                f.write(f"- {pkg}\n")
            
            f.write("\n### Python Packages Required\n")
            for pkg in dependency_summary['python_packages']:
                f.write(f"- {pkg}\n")
            
            if dependency_summary['import_errors']:
                f.write("\n### Import Issues\n")
                for error in dependency_summary['import_errors']:
                    f.write(f"- {error}\n")

        print(f"\nAnalysis complete. Results saved to {OUTPUT_FILE}")
        print(f"Total files processed: {len(processed_files)}")
        print(f"Failed analyses: {len(failed_files)}")

    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user. Progress has been saved.")
        save_progress(list(processed_files), list(failed_files))
        # Save any completed analyses
        if analyses:
            await save_analysis_results(analyses, OUTPUT_FILE)
    except Exception as e:
        print(f"\nError: {str(e)}")
        save_progress(list(processed_files), list(failed_files))
        # Save any completed analyses
        if analyses:
            await save_analysis_results(analyses, OUTPUT_FILE)

if __name__ == "__main__":
    asyncio.run(main())