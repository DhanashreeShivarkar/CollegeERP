import logging
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    TYPE_MASTER, 
    STATUS_MASTER, 
    SHIFT_MASTER,
    EMPLOYEE_MASTER  # Add this import
)

logger = logging.getLogger(__name__)

User = get_user_model()

class BaseAuditSerializer(serializers.ModelSerializer):
    CREATED_BY_NAME = serializers.SerializerMethodField()
    UPDATED_BY_NAME = serializers.SerializerMethodField()
    DELETED_BY_NAME = serializers.SerializerMethodField()

    def get_system_user_display(self, username):
        """Handle system user display names"""
        system_users = {
            'SYSTEM': 'System',
            'system': 'System',
            'admin': 'Administrator',
            'ADMIN': 'Administrator',
            None: 'System'
        }
        return system_users.get(username, username)

    def get_user_display_name(self, username):
        # Add debug logs
        logger.debug(f"======= SERIALIZER DEBUG =======")
        logger.debug(f"Getting display name for: {username}")
        logger.debug(f"User type: {type(username)}")
        
        if not username:
            logger.debug("Username is None or empty")
            return 'System'
            
        # First check if it's a system user
        system_name = self.get_system_user_display(username)
        if (system_name != username):
            return system_name

        try:
            user = User.objects.filter(USERNAME=username).first()
            logger.debug(f"Found user: {user}")
            if user:
                logger.debug(f"User USERNAME: {user.USERNAME}")
                return user.USERNAME  # Return USERNAME instead of full name
            logger.debug("No user found, returning original username")
            return username
        except Exception as e:
            logger.debug(f"Error occurred: {str(e)}")
            return username

    def get_CREATED_BY_NAME(self, obj):
        return self.get_user_display_name(obj.CREATED_BY)

    def get_UPDATED_BY_NAME(self, obj):
        return self.get_user_display_name(obj.UPDATED_BY)

    def get_DELETED_BY_NAME(self, obj):
        return self.get_user_display_name(getattr(obj, 'DELETED_BY', None))

    class Meta:
        abstract = True

class TypeMasterSerializer(BaseAuditSerializer):
    class Meta:
        model = TYPE_MASTER
        fields = [
            'ID', 'RECORD_WORD', 
            'CREATED_BY', 'CREATED_BY_NAME', 'CREATED_AT',
            'UPDATED_BY', 'UPDATED_BY_NAME', 'UPDATED_AT',
            'IS_DELETED'
        ]
        read_only_fields = ['ID', 'CREATED_AT', 'UPDATED_AT', 'CREATED_BY_NAME', 'UPDATED_BY_NAME']

class StatusMasterSerializer(BaseAuditSerializer):
    class Meta:
        model = STATUS_MASTER
        fields = [
            'ID', 'RECORD_WORD',
            'CREATED_BY', 'CREATED_BY_NAME', 'CREATED_AT',
            'UPDATED_BY', 'UPDATED_BY_NAME', 'UPDATED_AT',
            'IS_DELETED'
        ]
        read_only_fields = ['ID', 'CREATED_AT', 'UPDATED_AT', 'CREATED_BY_NAME', 'UPDATED_BY_NAME']

class ShiftMasterSerializer(BaseAuditSerializer):
    class Meta:
        model = SHIFT_MASTER
        fields = [
            'ID', 'SHIFT_NAME', 'FROM_TIME', 'TO_TIME',
            'LATE_COMING_TIME', 'EARLY_GOING_TIME',
            'CREATED_BY', 'CREATED_BY_NAME', 'CREATED_AT',
            'UPDATED_BY', 'UPDATED_BY_NAME', 'UPDATED_AT',
            'IS_DELETED'
        ]
        read_only_fields = ['ID', 'CREATED_AT', 'UPDATED_AT', 'CREATED_BY_NAME', 'UPDATED_BY_NAME']

class EmployeeMasterSerializer(BaseAuditSerializer):
    class Meta:
        model = EMPLOYEE_MASTER
        fields = '__all__'
        read_only_fields = ['CREATED_AT', 'UPDATED_AT']
        extra_kwargs = {
            # Required fields
            'EMPLOYEE_ID': {'required': True},
            'INSTITUTE': {'required': True},
            'EMP_NAME': {'required': True},
            'EMAIL': {'required': True},
            'DESIGNATION': {'required': True},
            'DEPARTMENT': {'required': True},
            'DATE_OF_JOIN': {'required': True},
            'MOBILE_NO': {'required': True},
            'SEX': {'required': True},
            'CATEGORY': {'required': True},
            
            # All other fields optional...
            'PERMANENT_ADDRESS': {'required': False},
            # ...rest of optional fields remain the same...
            'PERMANENT_CITY': {'required': False},
            'PERMANENT_PIN': {'required': False},
            'POSITION': {'required': False},
            'DATE_OF_BIRTH': {'required': False},
            'MARITAL_STATUS': {'required': False},
            'EMP_TYPE': {'required': False},
            'STATUS': {'required': False},
            'SHIFT': {'required': False},
            'LOCAL_ADDRESS': {'required': False},
            'PAN_NO': {'required': False},
            'DRIVING_LICENSE_NO': {'required': False},
            'LOCAL_CITY': {'required': False},
            'LOCAL_PIN': {'required': False},
            'BLOOD_GROUP': {'required': False},
            'IS_ACTIVE': {'required': False},
            'PHONE_NO': {'required': False},
            'BANK_ACCOUNT_NO': {'required': False},
            'UAN_NO': {'required': False},
        }

    def validate(self, data):
        logger.debug("Validating employee data:")
        logger.debug(f"EMPLOYEE_ID in data: '{data.get('EMPLOYEE_ID')}'")
        if not data.get('EMPLOYEE_ID'):
            raise serializers.ValidationError({"EMPLOYEE_ID": "This field is required"})
        return data

    def validate_email(self, value):
        if value:
            value = value.lower()
            if EMPLOYEE_MASTER.objects.filter(EMAIL=value).exists():
                raise serializers.ValidationError("Email already exists")
        return value

    def validate_mobile_no(self, value):
        if value and EMPLOYEE_MASTER.objects.filter(MOBILE_NO=value).exists():
            raise serializers.ValidationError("Mobile number already exists")
        return value

    # Remove the create method - let the viewset handle EMPLOYEE_ID
