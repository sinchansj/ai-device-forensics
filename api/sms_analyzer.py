import json
import os
import logging
from pathlib import Path
import datetime
from dateutil.parser import parse

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

def extract_recent_messages(days=30):
    """Extract messages from the last specified number of days"""
    try:
        data = load_forensic_data()
        today = datetime.datetime.now()
        cutoff_date = today - datetime.timedelta(days=days)
        
        recent_messages = []
        
        if "communications" in data and "messages" in data["communications"]:
            messages = data["communications"]["messages"]
            
            for message in messages:
                if "date" in message:
                    try:
                        message_date = parse(message["date"])
                        if message_date >= cutoff_date:
                            recent_messages.append(message)
                    except (ValueError, TypeError):
                        continue
        
        # Sort messages by date (newest first)
        recent_messages.sort(key=lambda x: parse(x["date"]) if "date" in x else parse("1900-01-01"), reverse=True)
        
        logger.info(f"Extracted {len(recent_messages)} messages from the last {days} days")
        return recent_messages
    except Exception as e:
        logger.error(f"Error extracting recent messages: {str(e)}")
        return []

def get_sms_analysis():
    """Return pre-generated SMS analysis from file"""
    try:
        analysis_path = Path("DataExtractor/reports/sms_forensic_analysis.txt")
        logger.info(f"Loading SMS analysis from {analysis_path}")
        
        if not analysis_path.exists():
            logger.warning("SMS analysis file not found")
            return {"analysis": "Analysis file not found. Please run the SMS analyzer first."}
        
        with open(analysis_path, "r", encoding="utf-8") as f:
            analysis_text = f.read()
        
        logger.info("Successfully loaded SMS analysis from file")
        return {"analysis": analysis_text}
        
    except Exception as e:
        logger.error(f"Error loading SMS analysis: {str(e)}")
        return {"analysis": f"Error loading analysis: {str(e)}"}