from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_representative = models.BooleanField(default=False)
    department = models.CharField(max_length=100, blank=True, null=True)
    gov_id = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    taluka = models.CharField(max_length=100, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    
    REP_LEVEL_CHOICES = [
        ('VILLAGE', 'Village'),
        ('TALUKA', 'Taluka'),
        ('DISTRICT', 'District'),
        ('STATE', 'State'),
    ]
    representative_level = models.CharField(max_length=20, choices=REP_LEVEL_CHOICES, default='TALUKA', blank=True, null=True)

    def __str__(self):
        return self.username
