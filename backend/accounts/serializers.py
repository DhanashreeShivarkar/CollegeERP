from rest_framework import serializers
from .models import COUNTRY, STATE, CITY, CURRENCY, LANGUAGE, DESIGNATION, CATEGORY

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = COUNTRY
        fields = ['COUNTRY_ID', 'NAME', 'CODE', 'PHONE_CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = STATE
        fields = ['STATE_ID', 'COUNTRY', 'NAME', 'CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CITY
        fields = ['CITY_ID', 'STATE', 'NAME', 'CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = CURRENCY
        fields = ['CURRENCY_ID', 'NAME', 'CODE', 'SYMBOL', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LANGUAGE
        fields = ['LANGUAGE_ID', 'NAME', 'CODE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DESIGNATION
        fields = ['DESIGNATION_ID', 'NAME', 'CODE', 'DESCRIPTION', 'PERMISSIONS', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CATEGORY
        fields = ['CATEGORY_ID', 'NAME', 'CODE', 'DESCRIPTION', 'RESERVATION_PERCENTAGE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY']

    def validate(self, data):
        # Validate code format
        if 'CODE' in data:
            data['CODE'] = data['CODE'].upper()
            if not data['CODE'].isalnum():
                raise serializers.ValidationError({
                    "error": "Invalid format",
                    "message": "Category code must contain only letters and numbers",
                    "field": "CODE"
                })

            # Check for existing code
            code = data['CODE']
            if self.instance is None:  # Only for creation
                if CATEGORY.objects.filter(CODE=code).exists():
                    raise serializers.ValidationError({
                        "error": "Duplicate entry",
                        "message": f"Category with code '{code}' already exists",
                        "field": "CODE"
                    })

        # Validate reservation percentage
        if 'RESERVATION_PERCENTAGE' in data:
            try:
                percentage = float(data['RESERVATION_PERCENTAGE'])
                if not (0 <= percentage <= 100):
                    raise serializers.ValidationError({
                        "error": "Invalid value",
                        "message": "Reservation percentage must be between 0 and 100",
                        "field": "RESERVATION_PERCENTAGE"
                    })
            except (TypeError, ValueError):
                raise serializers.ValidationError({
                    "error": "Invalid format",
                    "message": "Reservation percentage must be a valid number",
                    "field": "RESERVATION_PERCENTAGE"
                })

        return data
