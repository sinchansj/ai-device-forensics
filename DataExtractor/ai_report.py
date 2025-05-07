import json
import os
import google.generativeai as genai

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

# Function to compact JSON data
def compact_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)  # Load JSON data
    compacted_data = json.dumps(data, separators=(',', ':'))  # Compact the JSON data
    return compacted_data

# Function to generate a forensic report
def generate_forensic_report(data):
    prompt = f"""You are an experienced digital forensics investigator analyzing data extracted from an Android device. Rather than just listing findings, approach this like a detective piecing together a story. Analyze the communications data in particular, looking for significant patterns, shifts in behavior, and connections between contacts. Go beyond surface-level observations to speculate on possible underlying contexts or scenarios. What might these patterns suggest about the user’s activities, relationships, or movements? Highlight anything that stands out as potentially noteworthy, surprising, or indicative of a larger narrative.

Here's the extracted data:
{data}"""

    chat_session = model.start_chat(
        history=[
        ]
    )

    response = chat_session.send_message(prompt)
    return response.text

# Main execution
def main():
    file_path = './reports/forensic_report.json'  # Path to your JSON file
    
    # Compact the JSON file
    compacted_data = compact_json(file_path)
    
    # Generate the forensic report
    try:
        report = generate_forensic_report(compacted_data)

        # Save the report to a file
        with open('ai_report.txt', 'w', encoding='utf-8') as f:
            f.write(report)
    
        print("\nGenerated Forensic Report:\n")
        print(report)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
