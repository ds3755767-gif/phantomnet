from sklearn.tree import DecisionTreeClassifier
import numpy as np
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AttackerLog, BlacklistedIP
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import time
import random

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        is_attacker_flag = getattr(request, 'is_attacker', False)

        if is_attacker_flag:
            return JsonResponse({
                'status': 'success',
                'is_attacker': True,
                'user': username,
                'data': {
                    'balance': 1240500.00,
                    'account_no': '•••• •••• 9999',
                    'transactions': [
                        {'title': 'Wire Transfer (Pending)', 'date': '14 July 2026', 'amount': '+250000.00', 'type': 'credit'}
                    ]
                }
            })
        
        if username == "admin" and password == "secure123":
            return JsonResponse({
                'status': 'success',
                'is_attacker': False,
                'user': username,
                'data': {
                    'balance': 45230.89,
                    'account_no': '•••• •••• 5642',
                    'transactions': [
                        {'title': 'Salary Credit', 'date': '12 July 2026', 'amount': '+5000.00', 'type': 'credit'},
                        {'title': 'Server Hosting Payment', 'date': '10 July 2026', 'amount': '-120.00', 'type': 'debit'}
                    ]
                }
            })
        else:
            return JsonResponse({'status': 'failed', 'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def predict_attacker_type(failed_attempts, payload_text):
    X_train = np.array([[0, 0], [1, 0], [5, 0], [1, 1], [0, 1], [6, 1]])
    y_train = np.array([0, 0, 1, 2, 2, 2])
    
    clf = DecisionTreeClassifier()
    clf.fit(X_train, y_train)
    
    contains_sql = 1 if any(x in payload_text.upper() for x in ["SELECT", "UNION", "OR 1=1", "'", '"']) else 0
    prediction = clf.predict([[failed_attempts, contains_sql]])[0]
    
    mapping = {0: "Generic Scanner", 1: "Brute Force Attacker", 2: "SQL Injection Expert"}
    return mapping.get(prediction, "Unknown Anomaly")


def generate_cyber_dna(user_agent, failed_count, payload_text):
    platform = "WIN" if "Windows" in user_agent else "LIN" if "Linux" in user_agent else "BOT"
    contains_sql = "SQL" if any(x in payload_text.upper() for x in ["SELECT", "UNION", "OR 1=1", "'"]) else "GEN"
    intensity = "HIGH" if failed_count > 3 else "LOW"
    return f"{contains_sql}-{platform}-{intensity}"


@csrf_exempt
def log_attack_view(request):
    if request.method == 'POST':
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', 'Unknown Browser')
        
        try:
            data = json.loads(request.body)
            action = data.get('action', 'Unknown Trap Triggered')
            client_details = str(data.get('details', ''))
        except json.JSONDecodeError:
            action = "Raw Attack Attempt"
            client_details = ""

        failed_count = request.session.get('failed_login_attempts', 4)

        predicted_ai_type = predict_attacker_type(failed_count, client_details)
        hacker_dna = generate_cyber_dna(user_agent, failed_count, client_details)

        full_telemetry = {
            "client_action_data": client_details,
            "browser_user_agent": user_agent,
        }

        AttackerLog.objects.create(
            ip_address=ip_address,
            action_performed=action,
            payload_details=json.dumps(full_telemetry),
            attacker_type=predicted_ai_type,
            cyber_dna=hacker_dna
        )
        
        # ACTIVE MITIGATION: Tar-Pit delay simulator active
        time.sleep(4)

        return JsonResponse({'status': 'logged', 'message': 'Intrusion handled.'})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def ban_ip_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            ip_to_ban = data.get('ip_address')
            if ip_to_ban:
                BlacklistedIP.objects.get_or_create(ip_address=ip_to_ban)
                return JsonResponse({'status': 'success', 'message': f'IP {ip_to_ban} isolated.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def admin_stats_view(request):
    total_attacks = AttackerLog.objects.count()
    unique_attackers = AttackerLog.objects.values('ip_address').distinct().count()
    
    # 🌍 Visual Threat Intel simulation dataset arrays
    geo_pool = [
        {"country": "🇺🇸 USA Proxy Node", "coords": "Washington D.C. (Encrypted Route)"},
        {"country": "🇷🇺 Russia Tor Entry", "coords": "Moscow Outpost IP"},
        {"country": "🇨🇳 China Botnet Vector", "coords": "Beijing Subnet Leak"},
        {"country": "🇩🇪 Germany VPN Relay", "coords": "Frankfurt Gateway"}
    ]
    
    raw_logs = AttackerLog.objects.all().order_by('-timestamp')[:10]
    logs_list = []
    for index, log in enumerate(raw_logs):
        # 🛡️ MITRE ATT&CK Mapping Logic based on the triggered action
        if "HoneyToken" in log.action_performed:
            mitre_id = "T1083"
            mitre_tactic = "Discovery / Exfiltration"
        elif "Withdrawal" in log.action_performed:
            mitre_id = "T1041"
            mitre_tactic = "Exfiltration Over C2"
        else:
            mitre_id = "T1110"
            mitre_tactic = "Brute Force Credential Access"

        geo_data = geo_pool[index % len(geo_pool)]

        logs_list.append({
            'id': log.id,
            'ip_address': log.ip_address,
            'action_performed': log.action_performed,
            'attacker_type': log.attacker_type,
            'cyber_dna': log.cyber_dna,
            'geo_ip': geo_data["country"],
            'geo_coords': geo_data["coords"],
            'mitre_id': mitre_id,
            'mitre_tactic': mitre_tactic,
            'timestamp': log.timestamp.isoformat()
        })
    
    response = JsonResponse({
        'total_attacks': total_attacks,
        'unique_attackers': unique_attackers,
        'recent_logs': logs_list
    }, safe=False)
    
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@api_view(['GET'])
def fake_accounts_view(request):
    data = [
        {"id": 1, "name": "John Doe", "balance": "999999"},
        {"id": 2, "name": "Jane Smith", "balance": "123456"}
    ]
    response = Response(data)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response