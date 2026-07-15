import time
from django.http import JsonResponse
from django.core.cache import cache

class SuspiciousActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Attacker ka IP address nikalna
        ip_address = request.META.get('REMOTE_ADDR')
        
        # Cache me check karna ki kya is IP ko pehle se flag kiya gaya hai
        is_flagged = cache.get(f"flagged_{ip_address}", False)
        
        # Agar user login route par bohot zyada hits maar raha hai (Simulation)
        if request.path == '/api/login/' and request.method == 'POST':
            request_count = cache.get(f"hits_{ip_address}", 0) + 1
            cache.set(f"hits_{ip_address}", request_count, timeout=60) # 1 minute window
            
            # Agar 1 min me 5 se zyada hits hain, toh use 'Attacker' mark kar do
            if request_count > 5:
                cache.set(f"flagged_{ip_address}", True, timeout=3600) # 1 ghante ke liye block/honeypot
                is_flagged = True

        # Request ke andar ek custom attribute attach kar rahe hain
        request.is_attacker = is_flagged

        response = self.get_response(request)
        return response
    
    # Apne middleware ke beginning me add karo:
from banking.models import BlacklistedIP

from django.http import HttpResponseForbidden
from django.utils.safestring import mark_safe
from .models import BlacklistedIP

class CyberDeceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = request.META.get('REMOTE_ADDR')
        
        # 🛡️ CRITICAL BAN CHECK: Agar IP database me banned hai, toh instantly block karo
        if BlacklistedIP.objects.filter(ip_address=ip).exists():
            premium_ban_html = """
            <div style="background-color: #0b0f19; color: #f43f5e; font-family: 'Courier New', monospace; 
                        height: 100vh; display: flex; flex-direction: column; justify-content: center; 
                        align-items: center; text-align: center; margin: 0; padding: 20px;">
                <h1 style="font-size: 3rem; font-weight: 900; border: 2px solid #f43f5e; padding: 15px 30px; 
                           margin-bottom: 20px; box-shadow: 0 0 20px rgba(244, 63, 94, 0.4); animate: pulse 1s infinite;">
                    🛑 ACCESS DENIED // HARDWARE FIREWALL BLOCK
                </h1>
                <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px;">
                    Your IP address <b>{}</b> has been flagged and permanently isolated by the Enterprise SOC Countermeasure Engine.
                </p>
                <p style="font-size: 0.9rem; color: #64748b; margin-top: 30px;">
                    [PHANTOMNET DECEPTION MATRIX // STATUS: TERMINATED]
                </p>
            </div>
            """.format(ip)
            return HttpResponseForbidden(mark_safe(premium_ban_html))

        # ... baki tumhara purana dynamic middleware logic (Failed login counts, sandbox routing, etc.)
        response = self.get_response(request)
        return response