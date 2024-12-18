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
from typing import Dict, List, Set, Optional, TypedDict
import subprocess
import sys
from dataclasses import dataclass, asdict
from enum import Enum
import aiofiles
from openai import AsyncOpenAI
import argparse

# --- Feature Tracking Types ---
class ImplementationStatus(Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    PARTIALLY_IMPLEMENTED = "Partially Implemented"
    FULLY_IMPLEMENTED = "Fully Implemented"

class Priority(Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

@dataclass
class FeatureRequirement:
    id: str
    name: str
    description: str
    status: ImplementationStatus
    priority: Priority
    dependencies: List[str]
    implementing_files: List[str]
    coverage_score: float = 0.0

@dataclass
class ComponentDependency:
    source: str
    target: str
    dependency_type: str
    strength: float

class FeatureMetrics(TypedDict):
    total_features: int
    implemented_features: int
    partial_features: int
    not_started_features: int
    coverage_percentage: float
    high_priority_coverage: float

# --- Feature Tracking State ---
feature_registry: Dict[str, FeatureRequirement] = {}
component_dependencies: List[ComponentDependency] = []
feature_metrics: FeatureMetrics = {
    "total_features": 0,
    "implemented_features": 0,
    "partial_features": 0,
    "not_started_features": 0,
    "coverage_percentage": 0.0,
    "high_priority_coverage": 0.0
}

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

# Add near other constants at the top
SPECIAL_DIRS = {
    'venv',
    'node_modules',
    '.next',
    '__pycache__',
    '.git'
}

SKIP_FILES_IN = {
    'node_modules',
    'venv',
    '.venv',
    '__pycache__',
    'dist',
    'build',
    'Lib',
    'Scripts',
    'Include',
    'site-packages',
    'supafunc',
    'thinc',
    'setuptools',
    'packaging',
    'realtime',
    '_async',
    '_sync',
    'backends',
    'extra',
    'tests',
    'pip',
    'wheel',
    'dist-info',
    'egg-info',
    'bin',
    'include',
    'share',
    'man',
    'doc'
}

def is_library_path(path: str) -> bool:
    """Check if the path is within a library directory structure"""
    library_parent_dirs = {
        'site-packages',
        'dist-packages',
        'node_modules',
        'venv',
        '.venv',
        'Python311',  # Add specific Python version directories
        'Lib'
    }
    
    parts = Path(path).parts
    return any(part in library_parent_dirs for part in parts)

def should_process_directory(dirpath: str) -> bool:
    """
    Determine if we should process files in this directory.
    Returns True if directory should be processed, False if it should be skipped.
    """
    dir_name = os.path.basename(dirpath)
    
    # Skip if directory is in SKIP_FILES_IN
    if dir_name in SKIP_FILES_IN:
        return False
        
    # Skip if directory is within a library path
    if is_library_path(dirpath):
        return False
        
    return True

def get_env_keys(env_path: str) -> str:
    """Extract and return keys from .env file without their values"""
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            keys = []
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key = line.split('=')[0].strip()
                        keys.append(key)
            return f" # Contains keys: {', '.join(keys)}"
        except Exception as e:
            return f" # Error reading .env file: {str(e)}"
    return ""

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
        '.venv311'
        '*.pyc',
        '.idea'
    }
    
    # Define file extensions to analyze
    CODE_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.sql'}
    
    # Use absolute path for legal-buddy directory
    legal_buddy_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    code_files = []
    
    print("\nScanning for new files...")

    for root, dirs, files in os.walk(root_dir):
        if not should_process_directory(root):
            dirs[:] = []  # Don't recurse into special directories
            continue
        
        for file_path in files:
            full_path = str(Path(root) / file_path)  # Get full path
            
            # Skip if already processed - compare full paths
            if full_path in processed_files:
                continue
            
            # Improved directory exclusion check
            should_skip = False
            for part in Path(root).parts:
                if part in IGNORED_DIRS or any(ignored in part for ignored in IGNORED_DIRS):
                    should_skip = True
                    break
            if should_skip:
                continue
            
            # Only include specified file extensions
            if Path(file_path).suffix in CODE_EXTENSIONS:
                code_files.append(str(Path(root) / file_path))
                print(f"Found new file: {str(Path(root) / file_path)}")

    print(f"\nTotal new files found: {len(code_files)}")
            
    return code_files

def load_progress():
    """Load progress from previous run if it exists."""
    try:
        if os.path.exists(PROGRESS_FILE):
            with open(PROGRESS_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    data = json.loads(content)
                    # Convert to set of absolute paths
                    data['processed_files'] = {str(Path(p).absolute()) for p in data['processed_files']}
                    return data
        logging.info("No previous progress found, starting fresh")
    except Exception as e:
        logging.warning(f"Could not load progress file: {e}")
    return {'processed_files': set(), 'failed_files': []}

def save_progress(processed_files, failed_files):
    """Save current progress to file."""
    try:
        with open(PROGRESS_FILE, 'w') as f:
            # Convert sets to lists for JSON serialization
            json.dump({
                'processed_files': list(processed_files),
                'failed_files': list(failed_files),
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)
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

def extract_features_from_plan(plan_data: str) -> List[FeatureRequirement]:
    """Extract feature requirements from the plan file and create FeatureRequirement objects."""
    features = []
    try:
        # Find the CORE_FEATURES section
        core_features_match = re.search(r'CORE_FEATURES:\s*(.*?)(?=\n\w+:|$)', plan_data, re.DOTALL)
        if core_features_match:
            core_features_text = core_features_match.group(1)
            
            # Extract features using regex
            feature_sections = re.finditer(r'(\w+):\s*\n\s*-(.*?)(?=\n\w+:|$)', core_features_text, re.DOTALL)
            
            feature_id = 1
            for section in feature_sections:
                category = section.group(1)
                features_text = section.group(2)
                
                # Split features by dash
                feature_items = [f.strip() for f in features_text.split('-') if f.strip()]
                
                for item in feature_items:
                    feature = FeatureRequirement(
                        id=f"F{feature_id}",
                        name=item,
                        description=f"{category} feature",
                        status=ImplementationStatus.NOT_STARTED,
                        priority=Priority.HIGH,
                        dependencies=[],
                        implementing_files=[]
                    )
                    features.append(feature)
                    feature_id += 1
                    
        return features
    
    except Exception as e:
        logging.error(f"Error extracting features from plan: {e}")
        return []

def analyze_feature_implementation(file_content: str, features: List[FeatureRequirement]) -> List[dict]:
    """Analyze a file's content to determine which features it implements."""
    implemented_features = []
    
    for feature in features:
        # Convert feature name and description to lowercase for case-insensitive matching
        feature_terms = set((feature.name + " " + feature.description).lower().split())
        
        # Count how many feature terms are found in the file
        term_matches = sum(1 for term in feature_terms if term in file_content.lower())
        
        # Calculate a simple coverage score
        if len(feature_terms) > 0:
            coverage = term_matches / len(feature_terms)
        else:
            coverage = 0
            
        if coverage > 0:
            implementation_status = (
                ImplementationStatus.FULLY_IMPLEMENTED if coverage > 0.7
                else ImplementationStatus.PARTIALLY_IMPLEMENTED if coverage > 0.3
                else ImplementationStatus.IN_PROGRESS
            )
            
            implemented_features.append({
                "feature_id": feature.id,
                "status": implementation_status,
                "coverage_score": coverage,
                "details": f"Found {term_matches} relevant terms out of {len(feature_terms)}"
            })
            
    return implemented_features

def update_feature_metrics():
    """Update the global feature metrics based on current feature registry."""
    global feature_metrics
    
    total = len(feature_registry)
    implemented = sum(1 for f in feature_registry.values() if f.status == ImplementationStatus.FULLY_IMPLEMENTED)
    partial = sum(1 for f in feature_registry.values() if f.status == ImplementationStatus.PARTIALLY_IMPLEMENTED)
    not_started = sum(1 for f in feature_registry.values() if f.status == ImplementationStatus.NOT_STARTED)
    
    high_priority_features = [f for f in feature_registry.values() if f.priority == Priority.HIGH]
    high_priority_implemented = sum(1 for f in high_priority_features if f.status == ImplementationStatus.FULLY_IMPLEMENTED)
    
    feature_metrics.update({
        "total_features": total,
        "implemented_features": implemented,
        "partial_features": partial,
        "not_started_features": not_started,
        "coverage_percentage": (implemented + 0.5 * partial) / total * 100 if total > 0 else 0,
        "high_priority_coverage": high_priority_implemented / len(high_priority_features) * 100 if high_priority_features else 0
    })

def analyze_component_dependencies(file_content: str, filepath: str) -> List[ComponentDependency]:
    """Analyze component dependencies based on imports and usage patterns."""
    dependencies = []
    
    # Extract the component name from the filepath
    component_name = os.path.basename(filepath).split('.')[0]
    
    # Analyze imports
    import_matches = re.finditer(r'(?:import|require)\s*[\({]?\s*["\']([^"\']+)["\']', file_content)
    for match in import_matches:
        imported_path = match.group(1)
        if imported_path.startswith('.') or imported_path.startswith('@/'):
            # Local import - create dependency
            target_component = os.path.basename(imported_path).split('/')[-1].split('.')[0]
            
            # Calculate dependency strength based on usage
            usage_count = len(re.findall(rf'\b{target_component}\b', file_content))
            strength = min(1.0, usage_count / 10)  # Normalize strength to max 1.0
            
            dependencies.append(ComponentDependency(
                source=component_name,
                target=target_component,
                dependency_type="import",
                strength=strength
            ))
    
    return dependencies

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

async def analyze_file_with_claude(filepath: str, plan_data: str, client, rate_limiter, args):
    """Analyze a file using Claude API and return structured analysis."""
    try:
        # Read file contents
        with open(filepath, "r", encoding='utf-8') as f:
            code = f.read()
        
        # Analyze imports first
        import_analysis = analyze_imports(filepath)
        
        # Extract and analyze features
        features = extract_features_from_plan(plan_data)
        implemented_features = analyze_feature_implementation(code, features)
        
        # Analyze component dependencies
        dependencies = analyze_component_dependencies(code, filepath)
        component_dependencies.extend(dependencies)
        
        # Update feature registry with implementation details
        for impl in implemented_features:
            feature_id = impl["feature_id"]
            if feature_id in feature_registry:
                feature = feature_registry[feature_id]
                feature.status = impl["status"]
                feature.coverage_score = impl["coverage_score"]
                feature.implementing_files.append(filepath)
        
        # Update global metrics
        update_feature_metrics()
        
        await rate_limiter.acquire()
        
        # Define the prompt ONCE before the model check - use your EXACT original prompt
        prompt = f"""Analyze this file against the planned requirements:

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
                            "implemented_features": [
                                {{
                                    "feature_id": "string",
                                    "name": "string",
                                    "status": "Fully Implemented | Partially Implemented | In Progress",
                                    "coverage_score": float,
                                    "details": "string",
                                    "dependencies": ["string"],
                                    "risks": ["string"]
                                }}
                            ],
                            "missing_features": [
                                {{
                                    "feature_id": "string",
                                    "name": "string",
                                    "priority": "High | Medium | Low",
                                    "blocking_dependencies": ["string"],
                                    "implementation_suggestions": ["string"]
                                }}
                            ],
                            "component_dependencies": [
                                {{
                                    "source": "string",
                                    "target": "string",
                                    "type": "string",
                                    "strength": float,
                                    "notes": "string"
                                }}
                            ]
                        }},
                        "quality_metrics": {{
                            "code_organization": float,
                            "documentation": float,
                            "test_coverage": float,
                            "maintainability": float
                        }},
                        "technical_debt": [
                            {{
                                "type": "string",
                                "severity": "High | Medium | Low",
                                "description": "string",
                                "remediation_suggestion": "string"
                            }}
                        ]
                    }}"""

        if args.model == 'gpt-4o-mini':
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                max_tokens=4096,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            content = response.choices[0].message.content
        else:
            response = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                system="You are an expert software engineer analyzing code implementation against requirements.",
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            content = response.content[0].text

        try:
            # Remove control characters and find JSON
            cleaned_content = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', content)
            json_match = re.search(r'\{[\s\S]*\}', cleaned_content)
            if json_match:
                analysis_result = json.loads(json_match.group(0))
                # Add our additional analyses
                analysis_result['feature_tracking'] = {
                    'implemented_features': implemented_features,
                    'dependencies': [asdict(d) for d in dependencies],
                    'metrics': feature_metrics
                }
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
    """Save analysis results to file asynchronously."""
    try:
        if analyses is None:
            logging.error("Cannot save analysis results: analyses is None")
            return
            
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Custom JSON encoder to handle enums
        class EnumEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, Enum):
                    return obj.value
                return super().default(obj)
        
        # Use aiofiles for async file operations
        async with aiofiles.open(output_file, 'w', encoding='utf-8') as f:
            json_str = json.dumps(analyses, indent=2, ensure_ascii=False, cls=EnumEncoder)
            await f.write(json_str)
            
        logging.info(f"Successfully saved analysis results to {output_file}")
            
    except Exception as e:
        logging.error(f"Error saving analysis results: {e}")
        raise

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
    
    # Combine IGNORED_DIRS with our SKIP_FILES_IN
    IGNORED_DIRS = {
        # Original ignored dirs
        '.git', 'node_modules', '.next', '__pycache__', '.vscode',
        '.idea', 'dist', 'build', 'coverage', '.turbo',
        '.vercel', '.cache', '.husky', '.github',
        # Additional library directories to skip
        'venv', '.venv', 'env', 'venv311', 'Python311',
        'site-packages', 'dist-packages',
        'pip', 'setuptools', 'wheel',
        'supafunc', 'thinc', 'realtime',
        '_async', '_sync', 'backends',
        'extra', 'tests', 'migrations',
        'Lib', 'Scripts', 'Include',
        'bin', 'share', 'man', 'doc'
    }

    def should_include(path: Path) -> bool:
        """Check if path should be included in tree"""
        # Check if any parent directory is in ignored dirs
        for parent in path.parents:
            if parent.name in IGNORED_DIRS:
                return False
        
        # Always include .env files and core config files
        if path.name.endswith('.env') or path.name in {'.cursorrules', 'package.json', 'requirements.txt'}:
            return True
            
        # Skip library internals
        if any(lib in str(path) for lib in {'site-packages', 'dist-packages', 'node_modules'}):
            return False
            
        return True

    def add_to_tree(path: Path, prefix: str = "", is_last: bool = True):
        """Recursively build tree structure with descriptions."""
        if not should_include(path):
            return
            
        icon = "📁 " if path.is_dir() else "📄 "
        connector = "└── " if is_last else "├── "
        
        # Get description or use a default
        description = DESCRIPTIONS.get(path.name, "")
        description_text = f" # {description}" if description else ""
        
        # Add path to tree with description
        tree.append(f"{prefix}{connector}{icon}{path.name}{description_text}")
        
        if path.is_dir():
            # Filter items that should be included
            items = [item for item in sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name))
                    if should_include(item)]
                    
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

async def generate_analysis_report(analyses, feature_registry, component_dependencies):
    """Generate a comprehensive analysis report."""
    try:
        report_file = os.path.join(OUTPUT_DIR, "analysis_report.md")
        async with aiofiles.open(report_file, "w", encoding="utf-8") as f:
            await f.write("# Legal Buddy Implementation Analysis Report\n\n")
            
            # Overall Feature Implementation Status
            await f.write("## Feature Implementation Status\n\n")
            await f.write(f"Total Features: {feature_metrics['total_features']}\n")
            await f.write(f"Fully Implemented: {feature_metrics['implemented_features']}\n")
            await f.write(f"Partially Implemented: {feature_metrics['partial_features']}\n")
            await f.write(f"Not Started: {feature_metrics['not_started_features']}\n")
            await f.write(f"Overall Coverage: {feature_metrics['coverage_percentage']:.1f}%\n")
            await f.write(f"High Priority Coverage: {feature_metrics['high_priority_coverage']:.1f}%\n\n")
            
            # Feature Details
            await f.write("## Feature Details\n\n")
            for feature in feature_registry.values():
                await f.write(f"### {feature.name} ({feature.id})\n")
                await f.write(f"- Status: {feature.status.value}\n")
                await f.write(f"- Priority: {feature.priority.value}\n")
                await f.write(f"- Coverage Score: {feature.coverage_score:.1f}%\n")
                if feature.implementing_files:
                    await f.write("- Implementing Files:\n")
                    for file in feature.implementing_files:
                        await f.write(f"  * {file}\n")
                await f.write("\n")
            
            # Component Dependencies
            await f.write("## Component Dependencies\n\n")
            await f.write("```mermaid\ngraph TD\n")
            for dep in component_dependencies:
                await f.write(f"    {dep.source}-->{dep.target}\n")
            await f.write("```\n\n")
            
            # Technical Debt Summary
            await f.write("## Technical Debt Summary\n\n")
            debt_items = []
            for analysis in analyses:
                if "technical_debt" in analysis:
                    debt_items.extend(analysis["technical_debt"])
            
            if debt_items:
                for item in debt_items:
                    await f.write(f"### {item['type']} (Severity: {item['severity']})\n")
                    await f.write(f"- Description: {item['description']}\n")
                    await f.write(f"- Remediation: {item['remediation_suggestion']}\n\n")
            
            # Code Quality Metrics
            await f.write("## Code Quality Metrics\n\n")
            metrics = {
                "code_organization": [],
                "documentation": [],
                "test_coverage": [],
                "maintainability": []
            }
            
            for analysis in analyses:
                if "quality_metrics" in analysis:
                    for metric, value in analysis["quality_metrics"].items():
                        metrics[metric].append(value)
            
            for metric, values in metrics.items():
                if values:
                    avg = sum(values) / len(values)
                    await f.write(f"- {metric.replace('_', ' ').title()}: {avg:.1f}/10\n")
            
            # Dependencies
            dependency_summary = generate_dependency_summary(analyses)
            await f.write("\n## Dependencies\n")
            await f.write("\n### NPM Packages Required\n")
            for pkg in dependency_summary['npm_packages']:
                await f.write(f"- {pkg}\n")
            
            await f.write("\n### Python Packages Required\n")
            for pkg in dependency_summary['python_packages']:
                await f.write(f"- {pkg}\n")
            
            if dependency_summary['import_errors']:
                await f.write("\n### Import Issues\n")
                for error in dependency_summary['import_errors']:
                    await f.write(f"- {error}\n")
                    
        logging.info(f"Analysis report generated at {report_file}")
        
    except Exception as e:
        logging.error(f"Error generating analysis report: {str(e)}")
        raise

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--model',
        choices=['claude', 'gpt-4o-mini'],  # Correct model name
        default='claude',
        help='Choose model: claude or gpt-4o-mini'  # Correct model name
    )
    return parser.parse_args()

async def main():
    args = parse_args()
    
    if args.model == 'gpt-4o-mini':
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        client = AsyncOpenAI(api_key=api_key)
    else:
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        client = anthropic.AsyncAnthropic(api_key=api_key)

    analyses = []  # Initialize as empty list
    processed_files = set()
    failed_files = set()
    
    try:
        # Load existing analyses if any
        if os.path.exists(OUTPUT_FILE):
            try:
                async with aiofiles.open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                    content = await f.read()
                    analyses = json.loads(content)
                    logging.info(f"Loaded {len(analyses)} existing analyses")
            except json.JSONDecodeError:
                logging.warning("Could not load existing analyses, starting fresh")
                analyses = []

        # Generate and save the directory tree first
        tree_output = generate_directory_tree(CODEBASE_ROOT)
        tree_output_file = os.path.join(OUTPUT_DIR, "app_structure.md")
        
        print(f"\nGenerating App Structure...")
        async with aiofiles.open(tree_output_file, "w", encoding="utf-8") as f:
            await f.write("# Legal Buddy Web App Structure\n\n")
            await f.write("```\n")
            await f.write(tree_output)
            await f.write("\n```\n")
        print(f"App structure saved to {tree_output_file}\n")

        rate_limiter = RateLimit()

        # Load progress
        progress_data = load_progress()
        processed_files = set(progress_data['processed_files'])
        failed_files = set(progress_data['failed_files'])

        # Load plan
        plan_data = load_plan(PLAN_FILE)
        if not plan_data:
            logging.error("Failed to load plan data")
            return

        # Extract features from plan
        features = extract_features_from_plan(plan_data)
        for feature in features:
            feature_registry[feature.id] = feature

        # Get code files
        code_files = get_code_files(CODEBASE_ROOT)
        print(f"Found {len(code_files)} files to analyze...")

        # Process files
        remaining_files = [f for f in code_files if f not in processed_files]
        
        with tqdm(total=len(remaining_files), desc="Analyzing files") as pbar:
            for filepath in remaining_files:
                try:
                    result = await analyze_file_with_claude(
                        filepath=filepath,
                        plan_data=plan_data,
                        client=client,
                        rate_limiter=rate_limiter,
                        args=args
                    )
                    if result:
                        analyses.append(result)
                        processed_files.add(filepath)
                        # Save results after each successful analysis
                        await save_analysis_results(analyses, OUTPUT_FILE)
                    else:
                        failed_files.add(filepath)
                        logging.error(f"Analysis failed for {filepath}")
                except Exception as e:
                    failed_files.add(filepath)
                    logging.error(f"Error analyzing {filepath}: {str(e)}")
                pbar.update(1)
                
                # Save progress after each file
                save_progress(list(processed_files), list(failed_files))

        # Generate final report
        await generate_analysis_report(analyses, feature_registry, component_dependencies)

        print(f"\nAnalysis complete. Results saved to {OUTPUT_FILE}")
        print(f"Total files processed: {len(processed_files)}")
        print(f"Failed analyses: {len(failed_files)}")

    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user. Progress has been saved.")
        save_progress(list(processed_files), list(failed_files))
        if analyses:
            await save_analysis_results(analyses, OUTPUT_FILE)
    except Exception as e:
        logging.error(f"Error in main execution: {str(e)}")
        save_progress(list(processed_files), list(failed_files))
        if analyses:
            await save_analysis_results(analyses, OUTPUT_FILE)
        raise

if __name__ == "__main__":
    asyncio.run(main())