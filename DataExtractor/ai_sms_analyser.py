import json
import os
import datetime
from dateutil.parser import parse
import google.generativeai as genai

def extract_recent_messages(json_file_path, days=30):
    """Extract messages from the last specified number of days from a forensic report."""
    today = datetime.datetime.now()
    cutoff_date = today - datetime.timedelta(days=days)
    
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    
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
    
    recent_messages.sort(key=lambda x: parse(x["date"]) if "date" in x else parse("1900-01-01"), reverse=True)
    return recent_messages

def analyze_messages_with_ai(messages):
    """Use Gemini AI to analyze the messages from a forensic perspective."""
    genai.configure(api_key="AIzaSyAadytozwLf5XT4VuPGIwtNaY6NUNsioeM")

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

    message_content = json.dumps(messages, indent=2)

    prompt = f"""As an expert digital forensics analyst, please examine the following SMS messages 
    extracted from a mobile device over the past 30 days. Be creative in your analysis and highlight anything you find interesting or noteworthy.
    
    Provide a thorough analysis that includes:
    1. A general summary of communications
    2. Identification of important or suspicious patterns
    3. Notable contacts and their significance

    Keep the analysis under 200 words and dont format it, just regular text is fine.
    SMS Messages (JSON format):
    {message_content}
    """

    response = model.generate_content(prompt)
    return response.text

def main():
    file_path = "./reports/forensic_report.json"
    recent_messages = extract_recent_messages(file_path)
    
    if not recent_messages:
        return
    
    try:
        analysis = analyze_messages_with_ai(recent_messages)
        
        os.makedirs("./reports", exist_ok=True)
        output_path = "./reports/sms_forensic_analysis.txt"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(analysis)
            
    except Exception as e:
        # Minimal error handling
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()