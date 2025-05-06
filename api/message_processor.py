import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from collections import defaultdict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_forensic_data() -> Dict[str, Any]:
    """Load the forensic report data from JSON file"""
    try:
        file_path = Path("DataExtractor/reports/forensic_report.json")
        logger.info(f"Attempting to load forensic data from {file_path}")
        
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

def process_message_data() -> List[Dict[str, Any]]:
    """Process message data to generate statistics by month"""
    try:
        logger.info("Starting message data processing")
        data = load_forensic_data()
        messages = data.get("communications", {}).get("messages", [])
        
        if not messages:
            logger.warning("No message data found in forensic report")
            return []

        # Create monthly buckets for messages
        monthly_stats = defaultdict(lambda: {"sent": 0, "received": 0})
        
        # Process each message and put into monthly buckets
        for message in messages:
            try:
                message_date = datetime.strptime(message["date"], "%Y-%m-%d %H:%M:%S")
                month_key = message_date.strftime("%b %Y")
                
                if message.get("type") == "SENT":
                    monthly_stats[month_key]["sent"] += 1
                else:
                    monthly_stats[month_key]["received"] += 1
                
            except (ValueError, KeyError) as e:
                logger.warning(f"Error processing message entry: {e}")
                continue

        # Convert to list and sort by date
        message_data = [
            {
                "name": month_key,
                "sent": stats["sent"],
                "received": stats["received"]
            }
            for month_key, stats in sorted(monthly_stats.items(),
                key=lambda x: datetime.strptime(x[0], "%b %Y"))
        ]

        logger.info(f"Successfully processed message data into {len(message_data)} monthly buckets")
        return message_data

    except Exception as e:
        logger.error(f"Error processing message data: {str(e)}")
        return []

def process_hourly_distribution() -> List[Dict[str, Any]]:
    """Process message data to generate hourly distribution"""
    try:
        logger.info("Starting hourly distribution processing")
        data = load_forensic_data()
        messages = data.get("communications", {}).get("messages", [])
        
        if not messages:
            logger.warning("No message data found for hourly distribution")
            return []

        # Initialize hourly buckets
        hourly_stats = defaultdict(int)
        
        # Process each message
        for message in messages:
            try:
                message_date = datetime.strptime(message["date"], "%Y-%m-%d %H:%M:%S")
                hour = message_date.strftime("%H:00")
                hourly_stats[hour] += 1
                
            except (ValueError, KeyError) as e:
                logger.warning(f"Error processing message for hourly distribution: {e}")
                continue

        # Convert to list format needed by the frontend
        hourly_data = [
            {"hour": hour, "count": count}
            for hour, count in sorted(hourly_stats.items())
        ]

        logger.info("Successfully processed hourly distribution data")
        return hourly_data

    except Exception as e:
        logger.error(f"Error processing hourly distribution: {str(e)}")
        return []