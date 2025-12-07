from django.urls import path

from .views import IssueListCreateView, IssueDetailView, EscalateIssueView, IssueCommentListCreateView, NotificationListView, MarkNotificationReadView

urlpatterns = [
    path('', IssueListCreateView.as_view(), name='issue-list-create'),
    path('<int:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    path('<int:pk>/escalate/', EscalateIssueView.as_view(), name='escalate-issue'),
    path('<int:issue_id>/comments/', IssueCommentListCreateView.as_view(), name='issue-comments'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/read/', MarkNotificationReadView.as_view(), name='notification-read-all'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='notification-read-one'),
]
