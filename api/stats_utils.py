import json
from pathlib import Path

def get_forensic_stats():
    # Get the path to forensic_report.json
    report_path = Path(__file__).parent.parent / "DataExtractor" / "forensic_report.json"
    
    try:
        with open(report_path, 'r') as f:
            data = json.load(f)
            
        stats = {
            "call_count": len(data.get("communications", {}).get("calls", [])),
            "message_count": len(data.get("communications", {}).get("messages", [])),
            "hidden_files_count": len(data.get("hidden_files", []))
        }
        
        return stats
    except Exception as e:
        print(f"Error reading forensic report: {e}")
        return {
            "call_count": 0,
            "message_count": 0,
            "hidden_files_count": 0
        }