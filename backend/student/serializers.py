from rest_framework import serializers
from .models import Student
from .models import STUDENT_MASTER

class StudentMasterSerializer(serializers.ModelSerializer):
    ACTIVE = serializers.CharField(default='YES')
    VALIDITY = serializers.DateField(required=False, allow_null=True)
    ENTRYPERSON = serializers.CharField(default='Admin')
    
    class Meta:
        model = STUDENT_MASTER
        fields = [
            'ACADEMIC_YEAR',
            'STATUS',
            'INSTITUTE',
            'BRANCH_ID',
            'ADMISSION_CATEGORY',
            'ADMN_QUOTA_ID',
            'BATCH',
            'FORM_NO',
            'NAME',
            'FATHER_NAME',
            'SURNAME',
            'NAME_ON_CERTIFICATE',
            'EMAIL_ID',
            'GENDER',
            'DOB',
            'MOB_NO',
            'VALIDITY',
            'ACTIVE',
            'ENTRYPERSON'
        ]

    def validate_EMAIL_ID(self, value):
        if STUDENT_MASTER.objects.filter(EMAIL_ID=value).exists():
            raise serializers.ValidationError("Email ID already exists.")
        return value

    def validate_MOB_NO(self, value):
        if len(value) != 10 or not value.isdigit():
            raise serializers.ValidationError("Enter a valid 10-digit mobile number.")
        return value
