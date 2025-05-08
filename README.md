# Digital Forensics Dashboard

## Overview

Digital Forensics Dashboard is an advanced tool designed for extracting, analyzing, and visualizing digital evidence from Android devices. The application provides a comprehensive forensic analysis suite that helps investigators examine call records, text messages, network connections, file systems, and identify potentially suspicious activities.

## Features

- **Device Information Extraction**: Basic device details including model, Android version, and user information
- **Communications Analysis**: 
  - Call logs with detailed metadata (incoming, outgoing, missed calls)
  - SMS message extraction and categorization
  - Contact information association
- **Network Intelligence**: Extracted WiFi networks and connection histories
- **File System Analysis**:
  - Hidden file detection
  - Suspicious file identification based on patterns, permissions, and content
  - Media file extraction and categorization
  - Download history analysis
- **Suspicious Activity Detection**:
  - Night-time activities
  - Executable files with suspicious permissions
  - Encrypted or encoded content
  - Hidden media markers

## Technical Requirements

- Python 3.7+
- Android Debug Bridge (ADB) installed and accessible in PATH
- Connected Android device with USB debugging enabled
- Required Python packages:
  - subprocess
  - datetime
  - json
  - os

## Setup

1. Ensure Python 3.7+ is installed on your system
2. Install ADB and add it to your PATH
3. Enable USB debugging on the target Android device
4. Connect the device via USB
5. Clone this repository:
   ```
   git clone https://github.com/yourusername/digital-forensics-dashboard.git
   cd digital-forensics-dashboard
   ```

## Usage

1. Connect your Android device via USB with debugging enabled
2. Run the extractor:
   ```
   cd DataExtractor
   python run_extractor.py
   ```
3. The tool will extract forensic data and save it to forensic_report.json
4. Analyze the JSON report or use with the dashboard visualization tool

## Data Extracted

The tool extracts and structures the following data:

- **Device Information**: Model, Android version, username, last login
- **Call Records**: Number, type (incoming/outgoing/missed), date, duration, contact details
- **SMS Messages**: Number, content, type (sent/received), timestamp
- **Network Information**: SSID, security type
- **File System**: Photos, downloads, suspicious and hidden files

## Using with Caution

This tool is intended for legitimate forensic investigations and educational purposes only. Always:

1. Obtain proper authorization before examining any device
2. Follow legal and ethical guidelines for digital forensics
3. Maintain chain of custody for evidence
4. Document all actions taken during the investigation

## Future Enhancements

- Enhanced encryption detection 
- Timeline visualization
- Location data mapping
- App usage analysis
- Memory forensics capabilities
- Integration with other forensic tools

## License

This project is intended for educational and legitimate forensic use only. Please use responsibly and in compliance with relevant laws and regulations.


---

*Note: This dashboard is designed for educational purposes and legitimate forensic investigations only. Always ensure you have proper authorization before examining any device.*
