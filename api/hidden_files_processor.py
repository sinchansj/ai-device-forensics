import json
import logging
from pathlib import Path
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_forensic_data():
    """Load the forensic report data from JSON file"""
    try:
        file_path = Path("DataExtractor/reports/forensic_report.json")
        logger.info(f"Loading forensic data from {file_path}")
        
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            raise FileNotFoundError("forensic_report.json not found")
        
        with open(file_path, "r") as f:
            data = json.load(f)
        logger.info("Successfully loaded forensic data")
        return data
    except Exception as e:
        logger.error(f"Error loading forensic data: {str(e)}")
        raise

def process_hidden_files() -> List[Dict[str, Any]]:
    """Process hidden files information from the forensic report"""
    try:
        logger.info("Processing hidden files data")
        data = load_forensic_data()
        
        hidden_files = data.get("hidden_files", [])
        if not hidden_files:
            logger.warning("No hidden files found in forensic report")
            return []
            
        # Process and format hidden files data
        processed_files = []
        for file_entry in hidden_files:
            # Skip empty entries
            if not file_entry:
                continue
                
            # Create a structured file entry with consistent fields
            processed_entry = {
                "path": file_entry.get("path", "Unknown"),
                "size": file_entry.get("size", 0),
                "modified": file_entry.get("modified", "Unknown"),
                "owner": file_entry.get("owner", "Unknown"),
                "permissions": file_entry.get("permissions", "Unknown"),
                "content_analysis": file_entry.get("content_analysis", "No analysis available"),
                # Calculate severity based on content analysis
                "severity": calculate_severity(file_entry)
            }
            
            # Only add entries with at least a path
            if processed_entry["path"] != "Unknown":
                processed_files.append(processed_entry)
                
        logger.info(f"Successfully processed {len(processed_files)} hidden files")
        return processed_files
        
    except Exception as e:
        logger.error(f"Error processing hidden files: {str(e)}")
        return []

def calculate_severity(file_entry: Dict[str, Any]) -> str:
    """Calculate severity level based on file characteristics"""
    content_analysis = str(file_entry.get("content_analysis", "")).lower()
    path = str(file_entry.get("path", "")).lower()
    
    # High severity indicators
    high_severity_patterns = [
        "encrypted", "suspicious", "malware", "script", "obfuscated",
        "base64", "exploit", "keylog", "rootkit"
    ]
    
    # Medium severity indicators
    medium_severity_patterns = [
        "zip", "archive", "password", "secret", "hidden", 
        "private", "credentials", "certificate", "key"
    ]
    
    # Check for high severity first
    if any(pattern in content_analysis for pattern in high_severity_patterns):
        return "high"
    
    # Check path for high severity
    if any(pattern in path for pattern in [".key", "passwd", "shadow", "auth", "crypt"]):
        return "high"
        
    # Check for medium severity
    if any(pattern in content_analysis for pattern in medium_severity_patterns):
        return "medium"
        
    # Check path for medium severity
    if any(pattern in path for pattern in [".conf", "config", ".db", ".log"]):
        return "medium"
        
    # Default to low severity
    return "low"