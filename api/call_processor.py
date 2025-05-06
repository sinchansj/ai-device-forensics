import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
from collections import defaultdict, Counter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_forensic_data() -> Dict[str, Any]:
    """Load the forensic report data from JSON file"""
    try:
        file_path = Path("DataExtractor/forensic_report.json")
        logger.info(f"Attempting to load forensic data from {file_path}")
        
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            raise FileNotFoundError("forensic_report.json not found")
        
        with open(file_path, "r") as f:
            data = json.load(f)
        logger.info("Successfully loaded forensic data")
        return data
    except json.JSONDecodeError:
        logger.error("Failed to parse JSON from forensic_report.json")
        raise ValueError("Invalid JSON format in forensic_report.json")
    except Exception as e:
        logger.error(f"Unexpected error loading forensic data: {str(e)}")
        raise Exception(f"Error loading forensic data: {str(e)}")

def categorize_call(call: Dict[str, Any]) -> str:
    """Categorize a call based on its type"""
    call_type = call.get("type", "")
    if call_type == "INCOMING":
        return "incoming"
    elif call_type == "OUTGOING":
        return "outgoing"
    else:
        return "missed"

def process_call_data() -> List[Dict[str, Any]]:
    """Process call data to generate statistics by month and year"""
    try:
        logger.info("Starting call data processing")
        data = load_forensic_data()
        calls = data.get("communications", {}).get("calls", [])
        
        if not calls:
            logger.warning("No call data found in forensic report")
            return []

        logger.info(f"Processing {len(calls)} calls")

        # Create monthly buckets for calls
        monthly_stats = defaultdict(lambda: {"incoming": 0, "outgoing": 0, "missed": 0})
        
        # Counters for verbose logging
        total_incoming = 0
        total_outgoing = 0
        total_missed = 0
        total_processed = 0
        
        # Process each call and put into monthly buckets
        for call in calls:
            try:
                call_date = datetime.strptime(call["date"], "%Y-%m-%d %H:%M:%S")
                month_key = call_date.strftime("%b %Y")  # e.g. "Sep 2025"
                
                category = categorize_call(call)
                monthly_stats[month_key][category] += 1
                
                # Update totals for verbose logging
                if category == "incoming":
                    total_incoming += 1
                elif category == "outgoing":
                    total_outgoing += 1
                else:
                    total_missed += 1
                    
                total_processed += 1
                
            except (ValueError, KeyError) as e:
                logger.warning(f"Error processing call entry: {e}")
                continue

        # Log verbose statistics
        logger.info(f"Call Processing Summary:")
        logger.info(f"Total calls processed: {total_processed}")
        logger.info(f"Total incoming calls: {total_incoming}")
        logger.info(f"Total outgoing calls: {total_outgoing}")
        logger.info(f"Total missed calls: {total_missed}")

        # Convert to list and sort by date
        call_data = [
            {
                "name": month_key,
                "incoming": stats["incoming"],
                "outgoing": stats["outgoing"],
                "missed": stats["missed"]
            }
            for month_key, stats in sorted(monthly_stats.items(),
                key=lambda x: datetime.strptime(x[0], "%b %Y"))  # Fixed: using x[0] to get the month_key from the tuple
        ]

        logger.info(f"Successfully processed call data into {len(call_data)} monthly buckets")
        return call_data

    except Exception as e:
        logger.error(f"Error processing call data: {str(e)}", exc_info=True)
        return []

def process_call_type_data() -> List[Dict[str, Any]]:
    """Process call data to generate call type distribution"""
    try:
        logger.info("Starting call type distribution processing")
        data = load_forensic_data()
        calls = data.get("communications", {}).get("calls", [])
        
        if not calls:
            logger.warning("No call data found for type distribution")
            return []

        logger.info(f"Processing {len(calls)} calls for type distribution")

        # Initialize counters
        incoming = 0
        outgoing = 0
        missed = 0
        blocked = 0

        # Count different types of calls
        for call in calls:
            call_type = call.get("type", "")
            if call_type == "INCOMING":
                incoming += 1
            elif call_type == "OUTGOING":
                outgoing += 1
            elif call_type == "MISSED":
                missed += 1
            elif call_type == "BLOCKED" or call_type == "REJECTED":
                blocked += 1
        
        logger.info(f"Call distribution - Incoming: {incoming}, Outgoing: {outgoing}, Missed: {missed}, Blocked: {blocked}")
        
        result = [
            {"name": "Incoming", "value": incoming, "color": "#4ade80"},
            {"name": "Outgoing", "value": outgoing, "color": "#60a5fa"},
            {"name": "Missed", "value": missed, "color": "#f87171"},
            {"name": "Blocked", "value": blocked, "color": "#94a3b8"}
        ]

        logger.info("Successfully processed call type distribution")
        return result

    except Exception as e:
        logger.error(f"Error processing call type data: {str(e)}", exc_info=True)
        return []

def process_top_contacts() -> List[Dict[str, Any]]:
    """Process call data to generate top contacts by call frequency"""
    try:
        logger.info("Starting top contacts processing")
        data = load_forensic_data()
        calls = data.get("communications", {}).get("calls", [])
        
        if not calls:
            logger.warning("No call data found for contact analysis")
            return []

        logger.info(f"Processing {len(calls)} calls for top contacts")

        # Count calls per number and track contact names
        number_counts = Counter()
        contact_names = {}
        for call in calls:
            number = call.get("number")
            if number:
                # Normalize the number format
                number = number if number.startswith("+") else f"+{number}"
                number_counts[number] += 1
                
                # Track contact name if present
                contact_name = call.get("contact_name")
                if contact_name:
                    contact_names[number] = contact_name

        # Get top 5 contacts
        top_contacts = [
            {
                "number": number,
                "name": contact_names.get(number, "Unknown Contact"),
                "count": count
            }
            for number, count in number_counts.most_common(5)
        ]

        logger.info(f"Successfully processed top {len(top_contacts)} contacts")
        return top_contacts

    except Exception as e:
        logger.error(f"Error processing top contacts: {str(e)}", exc_info=True)
        return []