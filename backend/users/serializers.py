from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_representative', 'department', 'gov_id', 'phone', 'state', 'district', 'taluka', 'village', 'pincode', 'representative_level')

    def validate_password(self, value):
        # Regex: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(regex, value):
            raise serializers.ValidationError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_representative=validated_data.get('is_representative', False),
            department=validated_data.get('department', ''),
            gov_id=validated_data.get('gov_id', ''),
            phone=validated_data.get('phone', ''),
            state=validated_data.get('state', ''),
            district=validated_data.get('district', ''),
            taluka=validated_data.get('taluka', ''),
            village=validated_data.get('village', ''),
            pincode=validated_data.get('pincode', ''),
            representative_level=validated_data.get('representative_level', 'TALUKA')
        )
        return user
