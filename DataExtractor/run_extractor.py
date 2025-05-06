from forensic_extractor import ForensicExtractor
import os

def main():
    # Create output directory if it doesn't exist
    os.makedirs("reports", exist_ok=True)
    
    try:
        # Initialize extractor
        print("Initializing Forensic Extractor...")
        extractor = ForensicExtractor()
        
        # Run extraction
        print("Starting extraction process...")
        extractor.extract_all()
        
        # Save report to the reports directory
        report_path = os.path.join("reports", "forensic_report.json")
        extractor.save_report(report_path)
        
        print(f"\nExtraction complete! Report saved to {report_path}")
    
    except Exception as e:
        print(f"Error during extraction: {str(e)}")

if __name__ == "__main__":
    main()