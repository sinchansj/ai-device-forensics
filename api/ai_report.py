import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_ai_report():
    """Load the AI-generated forensic report"""
    try:
        report_path = Path("DataExtractor/reports/ai_report.txt")
        logger.info(f"Loading AI report from {report_path}")
        
        if not report_path.exists():
            logger.error(f"File not found: {report_path}")
            return {
                "error": "AI report not found",
                "executive_summary": ["Report not available"],
                "key_findings": ["Report not available"],
                "recommended_next_steps": ["Report not available"],
                "timeline_of_significant_events": []
            }
        
        with open(report_path, "r", encoding="utf-8") as f:
            # The file contains JSON content
            content = json.load(f)
            
        logger.info("Successfully loaded AI report data")
        return content
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing AI report as JSON: {e}")
        return {
            "error": f"Invalid JSON in AI report: {str(e)}",
            "executive_summary": ["Error parsing report"],
            "key_findings": ["Error parsing report"],
            "recommended_next_steps": ["Error parsing report"],
            "timeline_of_significant_events": []
        }
    except Exception as e:
        logger.error(f"Error loading AI report: {str(e)}")
        return {
            "error": f"Error loading AI report: {str(e)}",
            "executive_summary": ["Error loading report"],
            "key_findings": ["Error loading report"],
            "recommended_next_steps": ["Error loading report"],
            "timeline_of_significant_events": []
        }