from rest_framework import serializers

from .models import STUDENT_MASTER

class StudentMasterSerializer(serializers.ModelSerializer):    
    class Meta:

     model = STUDENT_MASTER 
     fields = [
        'ACADEMIC_YEAR',
        'STATUS',
        'INSTITUTE',
        'BRANCH_ID',
        'PROGRAM_CODE',  # Added PROGRAM_CODE field
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
        'STUDENT_ID',  # Added missing field
        'ACTIVE',      # Added missing field
        'ADMISSION_DATE'  # Added missing field
    ]


    def validate_PROGRAM_CODE(self, value):
        if not value:
            raise serializers.ValidationError("Program code is required.")
        return value

    def validate_EMAIL_ID(self, value):

        if not value:
            raise serializers.ValidationError("Email ID is required.")
        return value

    def validate_MOB_NO(self, value):
        if not value:
            raise serializers.ValidationError("Mobile number is required.")
        return value
