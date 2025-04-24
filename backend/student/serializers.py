from rest_framework import serializers
from .models import STUDENT_MASTER, CHECK_LIST_DOCUMENTS, STUDENT_DOCUMENTS, STUDENT_ROLL_NUMBER_DETAILS
from django.utils import timezone

# Define required fields at module level
BASIC_REQUIRED_FIELDS = [
    'INSTITUTE',
    'ACADEMIC_YEAR',
    'BATCH',
    'ADMISSION_CATEGORY',
    'ADMN_QUOTA_ID',  # Added this field
    'FORM_NO',
    'NAME',
    'SURNAME',
    'FATHER_NAME',
    'GENDER',
    'DOB',
    'MOB_NO',
    'EMAIL_ID',
    'PER_ADDRESS',
    'BRANCH_ID',
    'YEAR_SEM_ID',
]

class StudentMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = STUDENT_MASTER
        fields = '__all__'
        read_only_fields = ['STUDENT_ID']
        # Now BASIC_REQUIRED_FIELDS is accessible here
        extra_kwargs = {
            field: {'required': True} for field in BASIC_REQUIRED_FIELDS
        }
        
      

    def to_internal_value(self, data):
        # Set defaults for all non-required fields
        defaults = {
            # System fields
            'VALIDITY': timezone.now().date(),
            'ADMISSION_DATE': timezone.now().date(),
            'REGISTRATION_DATE': timezone.now().date(),
            'JOINING_STATUS_DATE': timezone.now().date(),
            'RETENTION_STATUS_DATE': timezone.now().date(),
            'ENTRYPERSON': 'SYSTEM',
            'EDITPERSON': 'SYSTEM',
            'IS_ACTIVE': 'YES',
            
            # Optional personal info fields
            'NAME_ON_CERTIFICATE': '',
            'MOTHER_NAME': '',
            'PARENT_NAME': '',
            'DOB_WORD': '',
            'DOP': None,
            
            # Optional contact fields
            'LOC_ADDRESS': '',
            'PER_PHONE_NO': '',
            'LOC_PHONE_NO': '',
            'EMERGENCY_NO': '',
            'PER_CITY': '',
            'LOC_CITY': '',
            'PER_PIN': '',
            'LOC_PIN': '',
            'PER_TALUKA': '',
            'PER_DIST': '',
            'LOC_TALUKA': '',
            'LOC_DIST': '',
            'PER_STATE_ID': 1,
            'LOC_STATE_ID': 1,
            
            # Optional other fields
            'NATIONALITY': 'INDIAN',
            'BLOOD_GR': 'O+',
            'CASTE': 'GENERAL',
            'RELIGION': '',
            'HANDICAPPED': 'NO',
            'MARK_ID': '0',
            'QUOTA_ID': int(data.get('ADMISSION_QUOTA', 1)),  # Use selected quota ID 
            'YEAR_SEM_ID': int(data.get('YEAR_SEM_ID') or 1),
            'ADMN_ROUND': '1',
            'ADMN_QUOTA_ID': int(data.get('ADMISSION_QUOTA', 0)),  # Use selected quota ID
            'STATUS': 'ACTIVE',
            'JOINING_STATUS': 'JOINED',
            'LATERAL_STATUS': 'NO',
            'BANK_NAME': '',
            'BANK_ACC_NO': '',
            'ENROLMENT_NO': ''
        }

        # Apply defaults for missing fields
        for field, default in defaults.items():
            if field not in data or not data[field]:
                data = data.copy() if not isinstance(data, dict) else data
                data[field] = default

        # Map INSTITUTE_CODE to INSTITUTE if needed
        if 'INSTITUTE_CODE' in data and 'INSTITUTE' not in data:
            data['INSTITUTE'] = data['INSTITUTE_CODE']

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

class StudentRollNumberDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = STUDENT_ROLL_NUMBER_DETAILS
        fields = [
            'RECORD_ID', 'INSTITUTE', 'BRANCH', 'YEAR', 'STUDENT',
            'ACADEMIC_YEAR', 'ROLL_NO', 'SEMESTER'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['STUDENT'] = {
            'STUDENT_ID': instance.STUDENT.STUDENT_ID,
            'ENROLLMENT_NO': instance.STUDENT.ENROLLMENT_NO,
            'NAME': instance.STUDENT.NAME
        }
        representation['ACADEMIC_YEAR'] = instance.ACADEMIC_YEAR.ACADEMIC_YEAR
        representation['INSTITUTE'] = instance.INSTITUTE.NAME
        representation['BRANCH'] = instance.BRANCH.NAME
        representation['YEAR'] = instance.YEAR.YEAR
        representation['SEMESTER'] = instance.SEMESTER.SEMESTER
        return representation
      
class CheckListDoumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CHECK_LIST_DOCUMENTS
        fields=['RECORD_ID','NAME', 'IS_MANDATORY']

class StudentDocumentsSerializer(serializers.ModelSerializer):
    STUDENT_ID = serializers.SlugRelatedField(
        queryset=STUDENT_MASTER.objects.all(),
        slug_field='STUDENT_ID'
    )
    DOC_NAME = serializers.SlugRelatedField(
        queryset=CHECK_LIST_DOCUMENTS.objects.all(),
        slug_field='NAME'
    )
    DOCUMENT_ID = serializers.SlugRelatedField(
        queryset=CHECK_LIST_DOCUMENTS.objects.all(),
        slug_field='RECORD_ID'
    )

    class Meta:
        model = STUDENT_DOCUMENTS
        fields = '__all__'

    def validate(self, data):
        if not data.get('STUDENT_ID'):
            raise serializers.ValidationError({'STUDENT_ID': 'Student is required'})
        if not data.get('DOCUMENT_ID'):
            raise serializers.ValidationError({'DOCUMENT_ID': 'Document ID is required'})
        if not data.get('DOC_NAME'):
            raise serializers.ValidationError({'DOC_NAME': 'Document name is required'})
        return data

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
