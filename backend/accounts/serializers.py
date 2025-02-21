from rest_framework import serializers
from .models import COUNTRY, STATE

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = COUNTRY
        fields = ['COUNTRY_ID', 'NAME', 'CODE', 'PHONE_CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = STATE
        fields = ['STATE_ID', 'COUNTRY', 'NAME', 'CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']
