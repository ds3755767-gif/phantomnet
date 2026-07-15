from django.db import models

class AttackerLog(models.Model):
    ip_address = models.CharField(max_length=45)
    action_performed = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    payload_details = models.TextField(blank=True, null=True)
    attacker_type = models.CharField(max_length=100, default="Unknown")
    cyber_dna = models.CharField(max_length=100, default="GEN-000-UNK") # <-- Cyber DNA Signature Field

    def __str__(self):
        return f"{self.ip_address} - {self.cyber_dna}"
    
class BlacklistedIP(models.Model):
    ip_address = models.CharField(max_length=45, unique=True)
    blocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ip_address