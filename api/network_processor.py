import json
import logging
from pathlib import Path
from typing import Dict, List, Any
from collections import Counter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_forensic_data() -> Dict[str, Any]:
    """Load the forensic report data from JSON file"""
    try:
        report_path = Path(__file__).parent.parent / "DataExtractor" / "reports" / "forensic_report.json"
        logger.info(f"Loading forensic data from {report_path}")
        
        with open(report_path, 'r') as f:
            data = json.load(f)
        
        return data
    except Exception as e:
        logger.error(f"Error loading forensic data: {e}")
        return {"networks": []}

def process_network_security_data() -> List[Dict[str, Any]]:
    """Process network data to get security distribution"""
    try:
        data = load_forensic_data()
        networks = data.get("networks", [])
        
        # Count security types
        security_counter = Counter()
        for network in networks:
            security_type = network.get("security", "unknown")
            # Simplify security types for better visualization
            if "wpa2" in security_type.lower():
                security_counter["WPA2"] += 1
            elif "wpa3" in security_type.lower():
                security_counter["WPA3"] += 1
            elif "open" in security_type.lower():
                security_counter["Open"] += 1 
            elif "owe" in security_type.lower():
                security_counter["OWE"] += 1
            else:
                security_counter["Other"] += 1
        
        # Convert to list format for chart
        result = [
            {"name": security, "value": count, "color": get_security_color(security)} 
            for security, count in security_counter.items()
        ]
        
        logger.info(f"Processed {len(networks)} networks with {len(result)} security types")
        return result
    except Exception as e:
        logger.error(f"Error processing network security data: {e}")
        return []

def get_security_color(security_type: str) -> str:
    """Return a color based on security type"""
    colors = {
        "WPA3": "#2563eb",  # Blue - Most secure
        "WPA2": "#4ade80",  # Green - Secure
        "OWE": "#eab308",   # Yellow - Somewhat secure
        "Open": "#ef4444",  # Red - Insecure
        "Other": "#a1a1aa",  # Gray - Unknown
    }
    return colors.get(security_type, "#a1a1aa")

def get_network_list() -> List[Dict[str, Any]]:
    """Return list of all networks with their details"""
    try:
        data = load_forensic_data()
        networks = data.get("networks", [])
        
        result = []
        for network in networks:
            # Directly use the SSID from the JSON
            ssid = network.get("ssid", "Unknown Network")
            security = network.get("security", "unknown")
            
            # Extract security type
            if "wpa2" in security.lower():
                security_type = "WPA2"
            elif "wpa3" in security.lower():
                security_type = "WPA3"
            elif "open" in security.lower():
                security_type = "Open"
            elif "owe" in security.lower():
                security_type = "OWE"
            else:
                security_type = "Unknown"
                
            result.append({
                "ssid": ssid,
                "security": security_type,
                "raw_security": security
            })
        
        return result
    except Exception as e:
        logger.error(f"Error processing network list: {e}")
        return []