import json
import os
import datetime
from dateutil.parser import parse
import google.generativeai as genai

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

def analyze_messages_with_ai(messages):
    """
    Use Gemini AI to analyze the messages from a forensic perspective.
    """
    # Configure the API key
    genai.configure(api_key="AIzaSyAadytozwLf5XT4VuPGIwtNaY6NUNsioeM")

    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 1024,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash-lite-001",
        generation_config=generation_config,
    )

    # Format messages for analysis
    message_content = json.dumps(messages, indent=2)

    # Prepare the prompt for the AI
    prompt = f"""As an expert digital forensics analyst, please examine the following SMS messages 
    extracted from a mobile device over the past 30 days. Be creative in your analysis and highlight anything you find interesting or noteworthy.
    
    Provide a thorough analysis that includes:
    1. A general summary of communications
    2. Identification of important or suspicious patterns
    3. Notable contacts and their significance
    
    SMS Messages (JSON format):
    {message_content}
    """

    # Get response from AI
    response = model.generate_content(prompt)
    return response.text

def main():
    # Path to the forensic report
    file_path = "./reports/forensic_report.json"
    
    # Extract messages from the last 30 days
    print("Extracting recent messages...")
    recent_messages = extract_recent_messages(file_path)
    print(f"Found {len(recent_messages)} messages from the last 30 days.")
    
    if not recent_messages:
        print("No recent messages found to analyze.")
        return
    
    # Display sample of extracted messages
    print("\nSample of extracted messages:")
    for i, msg in enumerate(recent_messages[:5]):  # Print first 5 for demonstration
        print(f"\n{i+1}. Date: {msg.get('date', 'Unknown')}")
        print(f"   From: {msg.get('number', 'Unknown')}")
        print(f"   Type: {msg.get('type', 'Unknown')}")
        print(f"   Content: {msg.get('content', 'No content')[:50]}...")
    
    # Analyze messages with AI
    print("\nAnalyzing messages with AI...")
    try:
        analysis = analyze_messages_with_ai(recent_messages)
        
        # Save analysis to file
        os.makedirs("./reports", exist_ok=True)
        output_path = "./reports/sms_forensic_analysis.txt"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(analysis)
        
        print(f"\nAnalysis saved to {output_path}")
        print("\n=== SMS Forensic Analysis ===\n")
        print(analysis)
        print("\n===========================\n")
    except Exception as e:
        print(f"Error during AI analysis: {str(e)}")

if __name__ == "__main__":
    main()