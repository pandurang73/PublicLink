from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Issue, IssueComment, Notification
from .serializers import IssueSerializer, IssueCommentSerializer, NotificationSerializer
from users.models import User
from django.shortcuts import get_object_or_404

class IssueListCreateView(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_representative:
            # Filter issues by the representative's taluka
            return Issue.objects.filter(taluka__iexact=user.taluka)
        # For citizens or unauthenticated users, return all issues (or filter as needed)
        return Issue.objects.all()

    def perform_create(self, serializer):
        issue = serializer.save(reported_by=self.request.user)
        # Notify Representatives of the same Taluka
        # Workaround for Djongo BooleanField issue: Filter by taluka first, then check is_representative in Python
        potential_reps = User.objects.filter(taluka=issue.taluka)
        reps = [u for u in potential_reps if u.is_representative]
        for rep in reps:
            Notification.objects.create(
                recipient=rep,
                issue=issue,
                text=f"New issue reported in {issue.taluka}: {issue.title}",
                type='NEW_ISSUE'
            )

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        issue = serializer.save()
        # If status changed, notify the citizen
        if 'status' in self.request.data:
            Notification.objects.create(
                recipient=issue.reported_by,
                issue=issue,
                text=f"Status updated for your issue '{issue.title}': {issue.status}",
                type='STATUS'
            )

class EscalateIssueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        issue = get_object_or_404(Issue, pk=pk)
        if not request.user.is_representative:
             return Response({'error': 'Only representatives can escalate issues.'}, status=status.HTTP_403_FORBIDDEN)
        
        issue.escalation_level += 1
        issue.save()
        
        # Notify Citizen
        Notification.objects.create(
            recipient=issue.reported_by,
            issue=issue,
            text=f"Your issue '{issue.title}' has been escalated to level {issue.escalation_level}",
            type='ESCALATION'
        )
        
        return Response({'status': 'Issue escalated', 'escalation_level': issue.escalation_level})

class IssueCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        issue_id = self.kwargs['issue_id']
        return IssueComment.objects.filter(issue_id=issue_id).order_by('created_at')

    def perform_create(self, serializer):
        issue_id = self.kwargs['issue_id']
        issue = get_object_or_404(Issue, pk=issue_id)
        comment = serializer.save(author=self.request.user, issue=issue)

        # Logic to notify the other party
        if self.request.user.is_representative:
            # Notify Citizen
            Notification.objects.create(
                recipient=issue.reported_by,
                issue=issue,
                text=f"Representative commented on '{issue.title}': {comment.text[:50]}...",
                type='COMMENT'
            )
        else:
            # Notify Representatives of that Taluka (or assigned rep if we had one)
            # Workaround for Djongo BooleanField issue: Filter by taluka first, then check is_representative in Python
            potential_reps = User.objects.filter(taluka=issue.taluka)
            reps = [u for u in potential_reps if u.is_representative]
            for rep in reps:
                Notification.objects.create(
                    recipient=rep,
                    issue=issue,
                    text=f"New comment on '{issue.title}': {comment.text[:50]}...",
                    type='COMMENT'
                )

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        if pk:
            notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({'status': 'marked as read'})
        else:
            # Mark all as read
            Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
            return Response({'status': 'all marked as read'})
