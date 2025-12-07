from django.db import models
from django.conf import settings

class Issue(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('ESCALATED', 'Escalated'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255) # Can be improved to GeoJSON later
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    taluka = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='LOW')
    
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_issues')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    
    escalation_level = models.IntegerField(default=0)
    last_escalated_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class IssueComment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.issue.title}"

class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, null=True, blank=True)
    text = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=[
        ('COMMENT', 'New Comment'),
        ('STATUS', 'Status Update'),
        ('ESCALATION', 'Issue Escalated'),
        ('NEW_ISSUE', 'New Issue Reported')
    ])

    def __str__(self):
        return f"Notification for {self.recipient.username}: {self.text}"
