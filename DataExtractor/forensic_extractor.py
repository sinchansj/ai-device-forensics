import subprocess
from datetime import datetime
import json
import os

class ForensicExtractor:
    def __init__(self):
        self.adb_path = "adb"  # Use adb from PATH environment variable
        self.check_setup()
        self.data = {
            "device_info": {},
            "communications": {
                "calls": [],
                "messages": []
            },
            "networks": [],
            "files": {
                "photos": [],
                "downloads": [],
                "recent_activity": []
            },
            "hidden_files": []
        }

    def check_setup(self):
        # Try to use ADB from the path first
        try:
            result = subprocess.run(["adb", "version"], capture_output=True, text=True)
            if result.returncode == 0:
                # ADB found in PATH, use that
                self.adb_path = "adb"
                print("Using ADB from system PATH")
            else:
                # Fall back to specific location
                self.adb_path = "D:/Programs/platform-tools/adb"
                if not os.path.exists(self.adb_path):
                    raise Exception("ADB not found. Please ensure platform-tools is in the correct location")
        except FileNotFoundError:
            # Fall back to specific location
            self.adb_path = "D:/Programs/platform-tools/adb"
            if not os.path.exists(self.adb_path):
                raise Exception("ADB not found. Please ensure platform-tools is in the correct location")
        
        # Now check if a device is connected
        try:
            result = subprocess.run([self.adb_path, 'devices'], 
                                  capture_output=True, 
                                  text=True)
            if "device" not in result.stdout:
                raise Exception("No device connected. Please check USB connection and debugging settings")
            print("Setup successful! Device connected and ready.")
        except Exception as e:
            print(f"Setup failed: {e}")
            raise

    def run_adb_command(self, command):
        try:
            # Use UTF-8 encoding and errors='replace' to handle encoding issues
            result = subprocess.run([self.adb_path] + command.split(), 
                                  capture_output=True, 
                                  text=True,
                                  encoding='utf-8',
                                  errors='replace')  # Replace invalid characters rather than failing
            return result.stdout.strip()
        except Exception as e:
            print(f"Error running command {command}: {e}")
            return None

    def extract_device_info(self):
        print("\nExtracting device info...")
        user_info = self.run_adb_command("shell dumpsys user")
        
        username = None
        last_login = None
        for line in user_info.split('\n'):
            if 'UserInfo{' in line:
                username = line.split(':')[1].split(':')[0]
            if 'Last logged in:' in line:
                last_login = line.split('Last logged in:')[1].strip()
        
        self.data['device_info'] = {
            'username': username,
            'model': self.run_adb_command("shell getprop ro.product.model"),
            'android_version': self.run_adb_command("shell getprop ro.build.version.release"),
            'last_login': last_login
        }

    def extract_calls_sms(self):
        print("\nStarting call extraction...")
        calls_output = self.run_adb_command('shell content query --uri content://call_log/calls')
        
        if not calls_output:
            print("No call data received")
            return

        print("\nProcessing calls...")
        for line in calls_output.split('Row:'):
            if not line.strip():
                continue

            print("\n" + "="*50)
            print("Processing new call record")

            call = {}
            try:
                # Split the line into individual fields
                fields = line.split(',')
                
                # Process each field
                for field in fields:
                    field = field.strip()
                    
                    # Core call information (keeping existing working type extraction)
                    if field.startswith('type='):
                        raw_type = field.replace('type=', '').strip()
                        print(f"Raw type string: '{raw_type}'")
                        try:
                            type_num = int(raw_type)
                            print(f"Converted type number: {type_num}")
                            call['type'] = {
                                1: 'INCOMING',
                                2: 'OUTGOING',
                                3: 'MISSED',
                                5: 'REJECTED',
                                4: 'VOICEMAIL',
                                6: 'BLOCKED',
                                7: 'ANSWERED_EXTERNALLY'
                            }.get(type_num)
                            if call['type'] is None:
                                print(f"WARNING: Unmapped type number: {type_num}")
                                call['type'] = f'UNKNOWN_{type_num}'
                            else:
                                print(f"Mapped to call type: {call['type']}")
                        except ValueError as e:
                            print(f"ERROR converting type '{raw_type}': {e}")
                            call['type'] = 'UNKNOWN'

                    # Number information
                    elif field.startswith('number='):
                        call['number'] = field.replace('number=', '').strip()
                    elif field.startswith('formatted_number='):
                        call['formatted_number'] = field.replace('formatted_number=', '').strip()
                    elif field.startswith('normalized_number='):
                        call['normalized_number'] = field.replace('normalized_number=', '').strip()
                    elif field.startswith('matched_number='):
                        call['matched_number'] = field.replace('matched_number=', '').strip()
                    elif field.startswith('numbertype='):
                        num_type = field.replace('numbertype=', '').strip()
                        if num_type != 'NULL':
                            call['number_type'] = num_type

                    # Timing information
                    elif field.startswith('duration='):
                        call['duration'] = field.replace('duration=', '').strip()
                    elif field.startswith('date='):
                        try:
                            timestamp = int(field.replace('date=', '').strip())
                            call['date'] = datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S')
                            call['timestamp'] = timestamp  # Keep raw timestamp
                        except ValueError as e:
                            print(f"ERROR processing date: {e}")
                    elif field.startswith('ring_time='):
                        ring_time = field.replace('ring_time=', '').strip()
                        if ring_time != '0':
                            call['ring_time'] = ring_time

                    # Contact information
                    elif field.startswith('name='):
                        name = field.replace('name=', '').strip()
                        if name and name != 'NULL':
                            call['contact_name'] = name
                    elif field.startswith('lookup_uri='):
                        uri = field.replace('lookup_uri=', '').strip()
                        if uri and uri != 'NULL':
                            call['contact_lookup_uri'] = uri
                    elif field.startswith('photo_uri='):
                        photo = field.replace('photo_uri=', '').strip()
                        if photo and photo != 'NULL':
                            call['contact_photo_uri'] = photo

                    # Location information
                    elif field.startswith('geocoded_location='):
                        location = field.replace('geocoded_location=', '').strip()
                        if location and location != 'NULL':
                            call['location'] = location
                    elif field.startswith('countryiso='):
                        country = field.replace('countryiso=', '').strip()
                        if country and country != 'NULL':
                            call['country'] = country

                    # Call status information
                    elif field.startswith('missed_reason='):
                        missed = field.replace('missed_reason=', '').strip()
                        if missed != '0':
                            call['missed_reason'] = missed
                    elif field.startswith('block_reason='):
                        block = field.replace('block_reason=', '').strip()
                        if block != '0':
                            call['block_reason'] = block
                    elif field.startswith('presentation='):
                        pres = field.replace('presentation=', '').strip()
                        if pres != '1':  # 1 is normal presentation
                            call['presentation'] = pres

                    # Device information
                    elif field.startswith('subscription_id='):
                        call['sim_id'] = field.replace('subscription_id=', '').strip()
                    elif field.startswith('phone_account_address='):
                        account = field.replace('phone_account_address=', '').strip()
                        if account and account != 'NULL':
                            call['phone_account'] = account

                    # Additional flags
                    elif field.startswith('is_read='):
                        is_read = field.replace('is_read=', '').strip()
                        if is_read and is_read.lower() != 'null':
                            call['is_read'] = bool(int(is_read))
                    elif field.startswith('new='):
                        new = field.replace('new=', '').strip()
                        if new:
                            call['is_new'] = bool(int(new))
                    elif field.startswith('is_special_number='):
                        special = field.replace('is_special_number=', '').strip()
                        if special != '0':
                            call['is_special'] = True

                # Only add if we have required fields
                if all(key in call for key in ['number', 'type', 'date']):
                    print("\nAdding call record:")
                    for key, value in call.items():
                        print(f"{key}: {value}")
                    self.data['communications']['calls'].append(call)
                else:
                    missing = [key for key in ['number', 'type', 'date'] if key not in call]
                    print(f"WARNING: Skipping incomplete call record. Missing: {missing}")

            except Exception as e:
                print(f"ERROR processing call record: {str(e)}")
                continue

        print("\nCall extraction completed")
        print(f"Total calls processed: {len(self.data['communications']['calls'])}")

        # Extract SMS
        print("\nExtracting SMS messages...")
        sms_output = self.run_adb_command('shell content query --uri content://sms')
        if sms_output:
            message_count = 0
            for line in sms_output.split('Row:'):
                if not line.strip():
                    continue
                    
                try:
                    message = {}
                    
                    # Extract data with fallback for missing fields
                    if 'address=' in line:
                        message['number'] = line.split('address=')[1].split(',')[0].strip()
                    
                    if 'body=' in line:
                        # Handle message body more carefully
                        body_parts = line.split('body=')[1].split(',')
                        if body_parts:
                            # The message body might contain commas, so we need to be careful
                            # with the splitting logic
                            message['content'] = body_parts[0].strip()
                    else:
                        message['content'] = "[No content]"
                    
                    if 'type=' in line:
                        try:
                            type_num = line.split('type=')[1].split(',')[0].strip()
                            message['type'] = 'RECEIVED' if type_num == '1' else 'SENT'
                        except (ValueError, IndexError):
                            message['type'] = 'UNKNOWN'
                    
                    if 'date=' in line:
                        try:
                            date_part = line.split('date=')[1].split(',')[0].strip()
                            timestamp = int(date_part)
                            message['date'] = datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S')
                            message['timestamp'] = timestamp
                        except (ValueError, IndexError):
                            message['date'] = "Unknown"
                    
                    # Only add if we have at least number and content
                    if 'number' in message and 'content' in message:
                        self.data['communications']['messages'].append(message)
                        message_count += 1
                
                except Exception as e:
                    print(f"Error processing SMS message: {str(e)}")
                    continue
            
            print(f"Successfully extracted {message_count} SMS messages")
        else:
            print("No SMS data received or permission denied")

    def extract_networks(self):
        print("\nExtracting network information...")
        wifi_output = self.run_adb_command('shell cmd wifi list-networks')
        if wifi_output:
            networks = []
            for line in wifi_output.split('\n'):
                if 'Network Id' not in line and line.strip():
                    parts = line.split()
                    if len(parts) >= 3:
                        network = {
                            "ssid": parts[1],
                            "security": ' '.join(parts[2:])
                        }
                        networks.append(network)
            self.data["networks"] = networks

    def scan_hidden_files(self):
        print("\nScanning for hidden and suspicious files...")
        
        # Accessible directories for unrooted devices
        directories = [
            '/sdcard',
            '/storage/emulated/0',
            '/sdcard/Download',
            '/sdcard/DCIM',
            '/sdcard/WhatsApp',
            '/data/local/tmp', 
        ]
        
        # Suspicious patterns (combining both approaches)
        suspicious_patterns = [
            r'\.nomedia$',           # Hidden media
            r'^\..*',               # Dot files
            r'\.enc$',              # Encrypted
            r'\.crypt\d*$',         # Encrypted backups
            r'\.db$',               # Databases
            r'\.log$',              # Logs
            r'\.zip$',              # Archives
            r'\.gpg$',              # Encrypted
            r'\.apk$',              # Rogue APKs
            r'\.(mp3|jpg|png)\.(exe|apk|bin)$'  # Double extensions
        ]
        
        suspicious_files = []
        
        for directory in directories:
            # Use find with maxdepth to avoid deep recursion
            cmd = f'shell find "{directory}" -type f -maxdepth 5 2>/dev/null'
            files = self.run_adb_command(cmd)
            if not files:
                continue
                
            for file in files.split('\n'):
                if not file.strip():
                    continue
                    
                # Check if file matches suspicious patterns
                import re
                if any(re.search(pattern, file, re.IGNORECASE) for pattern in suspicious_patterns):
                    # Get detailed metadata
                    stat_cmd = f'shell stat -c "%n|%s|%A|%y|%U" "{file}" 2>/dev/null'
                    stat_output = self.run_adb_command(stat_cmd)
                    if stat_output:
                        try:
                            parts = stat_output.split('|')
                            if len(parts) >= 5:
                                name = parts[0]
                                size = int(parts[1]) if parts[1].isdigit() else 0
                                perms = parts[2]
                                mod_time = parts[3]
                                owner = parts[4]
                                
                                file_info = {
                                    'path': name,
                                    'size': size,
                                    'permissions': perms,
                                    'modified': mod_time,
                                    'owner': owner,
                                    'directory': directory,
                                    'reasons': []
                                }
                                
                                # Identify why it's suspicious
                                if '.nomedia' in name:
                                    file_info['reasons'].append("Hidden media marker")
                                elif name.startswith('.'):
                                    file_info['reasons'].append("Hidden dot file")
                                elif re.search(r'\.enc$|\.crypt\d*$|\.gpg$', name, re.IGNORECASE):
                                    file_info['reasons'].append("Encrypted file")
                                elif re.search(r'\.db$', name, re.IGNORECASE):
                                    file_info['reasons'].append("Database file")
                                elif re.search(r'\.apk$', name, re.IGNORECASE):
                                    file_info['reasons'].append("Application package")
                                elif re.search(r'\.(mp3|jpg|png)\.(exe|apk|bin)$', name, re.IGNORECASE):
                                    file_info['reasons'].append("Double extension (possible disguise)")
                                    
                                # Timing anomaly check
                                try:
                                    from datetime import datetime
                                    # Try different time formats since Android devices may return different formats
                                    for fmt in ['%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d %H:%M:%S']:
                                        try:
                                            mod_dt = datetime.strptime(mod_time.split('.')[0], fmt)
                                            if 0 <= mod_dt.hour <= 5:
                                                file_info['reasons'].append("Modified during night hours (0-5 AM)")
                                            break
                                        except ValueError:
                                            continue
                                except Exception as e:
                                    print(f"Error parsing timestamp {mod_time}: {e}")
                                    
                                # Permission anomaly check
                                if perms.startswith('-rwx') and 'x' in perms[7:]:
                                    file_info['reasons'].append("Executable by all users")
                                    
                                # Content analysis for small files
                                if size < 1024 * 1024:  # <1MB
                                    file_info['content_analysis'] = self.analyze_file_content(file)
                                    
                                suspicious_files.append(file_info)
                        except Exception as e:
                            print(f"Warning: Could not parse stat output for {file}: {e}")
        
        # Sort by modification time (most recent first) and limit to 100
        try:
            suspicious_files.sort(key=lambda x: x.get('modified', ''), reverse=True)
        except Exception as e:
            print(f"Error sorting files: {e}")
            
        self.data['hidden_files'] = suspicious_files[:100]  # Limit for dashboard performance
        print(f"Found {len(suspicious_files)} suspicious files")

    def analyze_file_content(self, file_path):
        """Analyze file content for suspicious patterns"""
        file_type = self.run_adb_command(f'shell file "{file_path}" 2>/dev/null') or "Unknown"
        
        # Don't analyze obvious media files
        if any(ext in file_path.lower() for ext in ['.jpg', '.png', '.mp3', '.mp4', '.gif']):
            return f"File type: {file_type}"
            
        # Look for suspicious patterns in text files
        if 'text' in file_type.lower():
            head = self.run_adb_command(f'shell head -n 10 "{file_path}" 2>/dev/null')
            if not head:
                return "Unable to read content"
                
            analysis = []
            # Look for script markers
            if any(pattern in head.lower() for pattern in ['#!/', 'import ', 'function ', '<script', 'eval(', 'exec(']):
                analysis.append("Contains script code")
            # Look for encoded/encrypted content signatures
            if 'Salted__' in head or head.startswith('PK'):
                analysis.append("Possible encrypted/compressed content")
            # Look for Base64 patterns (lots of A-Za-z0-9+/ characters)
            if len(head) > 20 and all(c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=' for c in head[:20]):
                analysis.append("Possible Base64 encoded content")
                
            return "; ".join(analysis) if analysis else "No suspicious content patterns"
        
        return f"File type: {file_type}"

    def extract_files(self):
        print("\nExtracting file information...")
        
        # Get recent photos
        dcim_list = self.run_adb_command('shell ls -la /sdcard/DCIM/Camera/')
        if dcim_list:
            for line in dcim_list.split('\n'):
                if 'IMG_' in line or 'VID_' in line:
                    parts = line.split()
                    if len(parts) >= 8:
                        self.data['files']['photos'].append({
                            'name': ' '.join(parts[8:]),
                            'date': f"{parts[5]} {parts[6]} {parts[7]}",
                            'size': parts[4]
                        })

        # Get downloads
        downloads_list = self.run_adb_command('shell ls -la /sdcard/Download/')
        if downloads_list:
            for line in downloads_list.split('\n'):
                if line.strip() and not line.startswith('total'):
                    parts = line.split()
                    if len(parts) >= 8:
                        self.data['files']['downloads'].append({
                            'name': ' '.join(parts[8:]),
                            'date': f"{parts[5]} {parts[6]} {parts[7]}",
                            'size': parts[4]
                        })

    def extract_all(self):
        print("Starting focused forensic extraction...")
        self.extract_device_info()
        self.extract_calls_sms()
        self.extract_networks()
        self.extract_files()
        self.scan_hidden_files()
        return self.data
    
    def save_report(self, filename='forensic_report.json'):
        print(f"\nSaving raw data to {filename}...")
        with open(filename, 'w') as f:
            json.dump(self.data, f, indent=4)

        """Get contact name from phone number if it exists in contacts"""
        if not phone_number:
            return None
            
        # Sanitize phone number for query
        sanitized_number = phone_number.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        # Query the contacts provider
        lookup_cmd = f'shell content query --uri content://com.android.contacts/data/phones/filter/{sanitized_number} --projection display_name'
        result = self.run_adb_command(lookup_cmd)
        
        if result and 'display_name=' in result:
            try:
                contact_name = result.split('display_name=')[1].split(',')[0].strip()
                if contact_name and contact_name != 'NULL':
                    return contact_name
            except (IndexError, ValueError):
                pass
        
        return None