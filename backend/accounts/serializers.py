from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField()  # Changed from USER_ID
    password = serializers.CharField(style={'input_type': 'password'})  # Changed from PASSWORD
