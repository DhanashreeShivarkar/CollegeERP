from rest_framework import serializers
from .models import STUDENT_MASTER
from django.utils import timezone

class StudentMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = STUDENT_MASTER
        fields = '__all__'
        read_only_fields = ['STUDENT_ID']
        # Add this to make fields nullable/blankable
        extra_kwargs = {
            'NAME_ON_CERTIFICATE': {'allow_blank': True, 'required': False},
            'MOTHER_NAME': {'allow_blank': True, 'required': False},
            'LOC_ADDRESS': {'allow_blank': True, 'required': False},
            'PER_PHONE_NO': {'allow_blank': True, 'required': False},
            'LOC_PHONE_NO': {'allow_blank': True, 'required': False},
            'PER_PIN': {'allow_blank': True, 'required': False},
            'LOC_PIN': {'allow_blank': True, 'required': False},
            'RELIGION': {'allow_blank': True, 'required': False},
            'DOB_WORD': {'allow_blank': True, 'required': False},
            'BANK_NAME': {'allow_blank': True, 'required': False},
            'BANK_ACC_NO': {'allow_blank': True, 'required': False},
            'PER_TALUKA': {'allow_blank': True, 'required': False},
            'PER_DIST': {'allow_blank': True, 'required': False},
            'LOC_TALUKA': {'allow_blank': True, 'required': False},
            'LOC_DIST': {'allow_blank': True, 'required': False},
            'IS_ACTIVE': {'allow_null': False, 'required': True}
        }

    def to_internal_value(self, data):
        # Map INSTITUTE_CODE to INSTITUTE
        if 'INSTITUTE_CODE' in data and 'INSTITUTE' not in data:
            data['INSTITUTE'] = data['INSTITUTE_CODE']
        
        # Set defaults before validation
        current_date = timezone.now().date()
        
        # Set default values
        defaults = {
            'VALIDITY': current_date,
            'ADMISSION_DATE': current_date,
            'REGISTRATION_DATE': current_date,
            'JOINING_STATUS_DATE': current_date,
            'RETENTION_STATUS_DATE': current_date,
            'ENTRYPERSON': 'SYSTEM',
            'EDITPERSON': 'SYSTEM',
            'ENROLMENT_NO': data.get('STUDENT_ID', ''),
            'IS_ACTIVE': 'YES'
        }

        # Update data with defaults
        for key, value in defaults.items():
            if key not in data or not data[key]:
                data[key] = value

        # Empty strings for optional fields
        optional_fields = [
            'NAME_ON_CERTIFICATE', 'MOTHER_NAME', 'LOC_ADDRESS',
            'PER_PHONE_NO', 'LOC_PHONE_NO', 'PER_PIN', 'LOC_PIN',
            'RELIGION', 'DOB_WORD', 'BANK_NAME', 'BANK_ACC_NO',
            'PER_TALUKA', 'PER_DIST', 'LOC_TALUKA', 'LOC_DIST'
        ]

        for field in optional_fields:
            if field not in data or data[field] is None:
                data[field] = ''

        # Convert IS_ACTIVE to uppercase
        if 'IS_ACTIVE' in data:
            data = data.copy()
            data['IS_ACTIVE'] = str(data['IS_ACTIVE']).upper()

        return super().to_internal_value(data)

    def validate_BATCH(self, value):
        try:
            # Check if it's a valid year
            year = int(value)
            current_year = timezone.now().year
            
            # Batch year should be current year + 1 to current year + 6
            # (considering 4-year degree + 2 years buffer)
            if not (current_year + 1 <= year <= current_year + 6):
                raise serializers.ValidationError(
                    f"Batch year must be between {current_year + 1} and {current_year + 6}"
                )
            return str(year)
        except ValueError:
            raise serializers.ValidationError("Batch must be a valid year (e.g., 2025)")

    def create(self, validated_data):
        print("Final data being saved:", validated_data)
        return super().create(validated_data)
