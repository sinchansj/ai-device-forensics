import json
import datetime
from dateutil.parser import parse

def extract_recent_messages(json_file_path, days=30):
    """
    Extract messages from the last specified number of days from a forensic report.
    
    Args:
        json_file_path: Path to the forensic report JSON file
        days: Number of days to look back (default 30)
    
    Returns:
        A list of recent messages
    """
    # Calculate the cutoff date (30 days ago from today)
    today = datetime.datetime.now()
    cutoff_date = today - datetime.timedelta(days=days)
    
    # Load the JSON data
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
    recent_messages = []
    
    # Check if the messages key exists and contains data
    if "communications" in data and "messages" in data["communications"]:
        messages = data["communications"]["messages"]
        
        for message in messages:
            # Check if message has date and other required fields
            if "date" in message:
                try:
                    message_date = parse(message["date"])
                    if message_date >= cutoff_date:
                        # Add this message to our list of recent messages
                        recent_messages.append(message)
                except (ValueError, TypeError):
                    # Skip messages with invalid dates
                    continue
    
    # Sort messages by date (newest first)
    recent_messages.sort(key=lambda x: parse(x["date"]) if "date" in x else parse("1900-01-01"), reverse=True)
    
    return recent_messages

# Example usage
file_path = "./reports/forensic_report.json"
recent_msgs = extract_recent_messages(file_path)

print(f"Found {len(recent_msgs)} messages from the last 30 days:")
for i, msg in enumerate(recent_msgs[:10]):  # Print first 10 for demonstration
    print(f"\n{i+1}. Date: {msg.get('date', 'Unknown')}")
    print(f"   From: {msg.get('number', 'Unknown')} ({msg.get('display_name', 'Unknown')})")
    print(f"   Type: {msg.get('type', 'Unknown')}")
    print(f"   Content: {msg.get('content', 'No content')[:50]}...")