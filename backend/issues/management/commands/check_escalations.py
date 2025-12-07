from django.core.management.base import BaseCommand
from django.utils import timezone
from issues.models import Issue, Notification
from users.models import User
from datetime import timedelta

class Command(BaseCommand):
    help = 'Check for overdue issues and escalate them'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        
        # Thresholds (For testing, we can use minutes, but for prod use days)
        # Using shorter times for demonstration/testing as per user request context implies rapid dev
        # But standard logic:
        TALUKA_ESCALATION_THRESHOLD = timedelta(days=7)
        DISTRICT_ESCALATION_THRESHOLD = timedelta(days=5)

        # 1. Escalate from Taluka (Level 0) to District (Level 1)
        overdue_taluka_issues = Issue.objects.filter(
            status__in=['OPEN', 'IN_PROGRESS'],
            escalation_level=0,
            created_at__lte=now - TALUKA_ESCALATION_THRESHOLD
        )

        for issue in overdue_taluka_issues:
            self.escalate_issue(issue, 1)

        # 2. Escalate from District (Level 1) to State (Level 2)
        overdue_district_issues = Issue.objects.filter(
            status__in=['OPEN', 'IN_PROGRESS'],
            escalation_level=1,
            last_escalated_at__lte=now - DISTRICT_ESCALATION_THRESHOLD
        )

        for issue in overdue_district_issues:
            self.escalate_issue(issue, 2)

        self.stdout.write(self.style.SUCCESS(f'Checked escalations at {now}'))

    def escalate_issue(self, issue, new_level):
        old_level = issue.escalation_level
        issue.escalation_level = new_level
        issue.last_escalated_at = timezone.now()
        issue.status = 'ESCALATED'
        
        # Find new assignee
        new_assignee = self.find_next_level_rep(issue, new_level)
        if new_assignee:
            issue.assigned_to = new_assignee
            # Notify new assignee
            Notification.objects.create(
                recipient=new_assignee,
                issue=issue,
                text=f"Issue #{issue.id} has been escalated to you.",
                type='ESCALATION'
            )
        
        issue.save()

        # Notify original reporter
        Notification.objects.create(
            recipient=issue.reported_by,
            issue=issue,
            text=f"Your issue #{issue.id} has been escalated to Level {new_level}.",
            type='ESCALATION'
        )
        
        self.stdout.write(self.style.WARNING(f'Escalated Issue {issue.id} from Level {old_level} to {new_level}'))

    def find_next_level_rep(self, issue, level):
        if level == 1: # District
            # Find District Rep for the issue's district
            return User.objects.filter(
                is_representative=True,
                representative_level='DISTRICT',
                district__iexact=issue.district,
                state__iexact=issue.state
            ).first()
        elif level == 2: # State
            # Find State Rep for the issue's state
            return User.objects.filter(
                is_representative=True,
                representative_level='STATE',
                state__iexact=issue.state
            ).first()
        return None
