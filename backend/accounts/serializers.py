from rest_framework import serializers
from .models import COUNTRY, CustomUser

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = COUNTRY
        fields = ['COUNTRY_ID', 'NAME', 'CODE', 'PHONE_CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']
        read_only_fields = ['COUNTRY_ID']

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField()  # Changed from USER_ID
    password = serializers.CharField(style={'input_type': 'password'})  # Changed from PASSWORD
