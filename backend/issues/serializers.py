from rest_framework import serializers
from .models import Issue, IssueComment, Notification
from users.serializers import UserSerializer

class IssueSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)

    class Meta:
        model = Issue
        fields = '__all__'

class IssueCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    is_rep = serializers.ReadOnlyField(source='author.is_representative')

    class Meta:
        model = IssueComment
        fields = ['id', 'issue', 'author', 'author_name', 'is_rep', 'text', 'created_at']
        read_only_fields = ['author', 'issue']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
