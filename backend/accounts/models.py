from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import random
import string
from core.models import AuditModel
from django.contrib.auth.models import AbstractUser, BaseUserManager
import secrets
from datetime import datetime, timedelta

# Add BaseHistoryModel
class BaseHistoryModel(models.Model):
    HISTORY_ID = models.AutoField(primary_key=True, db_column='HISTORY_ID')
    ACTION = models.CharField(max_length=10, db_column='ACTION')  # INSERT/UPDATE/DELETE
    ACTION_BY = models.ForeignKey('CustomUser', on_delete=models.PROTECT, db_column='ACTION_BY')
    ACTION_AT = models.DateTimeField(auto_now_add=True, db_column='ACTION_AT')
    OLD_DATA = models.JSONField(null=True, blank=True, db_column='OLD_DATA')
    NEW_DATA = models.JSONField(null=True, blank=True, db_column='NEW_DATA')

    class Meta:
        abstract = True

class CustomUserManager(models.Manager):
    def get_by_natural_key(self, username):
        """
        Enable authentication via USERNAME field
        """
        return self.get(USERNAME=username)

    def normalize_email(self, email):
        """
        Normalize the email address by lowercasing it.
        """
        return email.lower() if email else None

    def create_user(self, USER_ID, USERNAME, EMAIL, password=None, **extra_fields):
        if not USER_ID:
            raise ValueError('USER_ID is required')
        if not USERNAME:
            raise ValueError('USERNAME is required')
        if not EMAIL:
            raise ValueError('EMAIL is required')

        user = self.model(
            USER_ID=USER_ID,
            USERNAME=USERNAME,
            EMAIL=self.normalize_email(EMAIL),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, USER_ID, USERNAME, EMAIL, password=None, **extra_fields):
        extra_fields.setdefault('IS_STAFF', True)
        extra_fields.setdefault('IS_SUPERUSER', True)
        extra_fields.setdefault('IS_ACTIVE', True)
        extra_fields.setdefault('IS_EMAIL_VERIFIED', True)
        extra_fields.setdefault('FAILED_LOGIN_ATTEMPTS', 0)
        extra_fields.setdefault('IS_LOCKED', False)
        extra_fields.setdefault('OTP_ATTEMPTS', 0)
        extra_fields.setdefault('OTP_VERIFIED', False)
        extra_fields.setdefault('MAX_OTP_TRY', 3)

        # Remove DESIGNATION from required fields for createsuperuser command
        if self.model.REQUIRED_FIELDS and 'DESIGNATION' in self.model.REQUIRED_FIELDS:
            self.model.REQUIRED_FIELDS.remove('DESIGNATION')

        # Get or create superadmin designation
        from django.db import transaction
        with transaction.atomic():
            try:
                designation = DESIGNATION.objects.get(CODE='SUPERADMIN')
            except DESIGNATION.DoesNotExist:
                designation = DESIGNATION.objects.create(
                    NAME='Super Admin',
                    CODE='SUPERADMIN',
                    DESCRIPTION='Full system access',
                    PERMISSIONS={'all_modules': {'read': True, 'create': True, 'update': True, 'delete': True}},
                    IS_ACTIVE=True
                )
            
            extra_fields['DESIGNATION'] = designation
            
            return self.create_user(USER_ID, USERNAME, EMAIL, password, **extra_fields)

    def make_random_password(self, length=10, 
                           allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'):
        """
        Generate a random password with the given length and allowed characters.
        """
        return ''.join(random.choice(allowed_chars) for i in range(length))

class DESIGNATION_HISTORY(BaseHistoryModel):
    DESIGNATION = models.ForeignKey('DESIGNATION', on_delete=models.CASCADE, db_column='DESIGNATION_ID')

    class Meta:
        db_table = 'DESIGNATIONS_HISTORY'

class USER_HISTORY(BaseHistoryModel):
    USER = models.ForeignKey('CustomUser', on_delete=models.CASCADE, db_column='USER_ID', related_name='history_records')

    class Meta:
        db_table = 'USERS_HISTORY'

class DESIGNATION(AuditModel):
    DESIGNATION_ID = models.AutoField(primary_key=True, db_column='DESIGNATION_ID')
    NAME = models.CharField(max_length=50, unique=True, db_column='NAME')
    CODE = models.CharField(max_length=20, unique=True, db_column='CODE')
    DESCRIPTION = models.TextField(null=True, blank=True, db_column='DESCRIPTION')
    PERMISSIONS = models.JSONField(
        default=dict, 
        db_column='PERMISSIONS',
        help_text='Define permissions like {"module_name": {"action": bool}}'
    )
    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')
    CREATED_AT = models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')
    UPDATED_AT = models.DateTimeField(auto_now=True, db_column='UPDATED_AT')

    class Meta:
        db_table = 'DESIGNATIONS'
        verbose_name = 'Designation'
        verbose_name_plural = 'Designations'

    def __str__(self):
        return f"{self.DESIGNATION_ID} - {self.NAME}"

    def save(self, *args, **kwargs):
        action = 'INSERT' if not self.pk else 'UPDATE'
        old_data = None
        if self.pk:
            old_instance = DESIGNATION.objects.get(pk=self.pk)
            old_data = {
                'NAME': old_instance.NAME,
                'CODE': old_instance.CODE,
                'DESCRIPTION': old_instance.DESCRIPTION,
                'PERMISSIONS': old_instance.PERMISSIONS,
                'IS_ACTIVE': old_instance.IS_ACTIVE
            }
        
        super().save(*args, **kwargs)
        
        new_data = {
            'NAME': self.NAME,
            'CODE': self.CODE,
            'DESCRIPTION': self.DESCRIPTION,
            'PERMISSIONS': self.PERMISSIONS,
            'IS_ACTIVE': self.IS_ACTIVE
        }
        
        DESIGNATION_HISTORY.objects.create(
            DESIGNATION=self,
            ACTION=action,
            ACTION_BY=self.UPDATED_BY,
            OLD_DATA=old_data,
            NEW_DATA=new_data
        )

    def delete(self, *args, **kwargs):
        DESIGNATION_HISTORY.objects.create(
            DESIGNATION=self,
            ACTION='DELETE',
            ACTION_BY=self.DELETED_BY or self.UPDATED_BY,
            OLD_DATA={
                'NAME': self.NAME,
                'CODE': self.CODE,
                'DESCRIPTION': self.DESCRIPTION,
                'PERMISSIONS': self.PERMISSIONS,
                'IS_ACTIVE': self.IS_ACTIVE
            }
        )
        super().delete(*args, **kwargs)

class PASSWORD_HISTORY(models.Model):
    PASSWORD_HISTORY_ID = models.AutoField(primary_key=True, db_column='PASSWORD_HISTORY_ID')
    USER = models.ForeignKey(
        'CustomUser', 
        on_delete=models.CASCADE, 
        related_name='password_history',
        db_column='USER_ID'
    )
    PASSWORD = models.CharField(max_length=128, db_column='PASSWORD')
    CREATED_AT = models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')

    class Meta:
        db_table = 'PASSWORD_HISTORY'
        ordering = ['-CREATED_AT']

class CustomUser(AbstractUser):
    # Disable default fields completely
    last_login = None  
    date_joined = None
    
    # Use our uppercase versions
    LAST_LOGIN = models.DateTimeField(null=True, blank=True, db_column='LAST_LOGIN')
    DATE_JOINED = models.DateTimeField(default=timezone.now, db_column='DATE_JOINED')
    
    # Required fields for Django auth
    USERNAME_FIELD = 'USERNAME'
    EMAIL_FIELD = 'EMAIL'
    REQUIRED_FIELDS = ['EMAIL', 'USER_ID']  # Add as class variable, not instance variable
    
    # Primary Key
    USER_ID = models.CharField(
        primary_key=True,
        max_length=20,
        db_column='USER_ID'
    )

    # Authentication fields
    USERNAME = models.CharField(
        max_length=150,
        unique=True,
        db_column='USERNAME'
    )
    PASSWORD = models.CharField(
        max_length=128,
        db_column='PASSWORD'
    )
    EMAIL = models.EmailField(
        unique=True,
        db_column='EMAIL'
    )

    # Personal Information
    FIRST_NAME = models.CharField(max_length=150, db_column='FIRST_NAME')
    LAST_NAME = models.CharField(max_length=150, db_column='LAST_NAME')
    DESIGNATION = models.ForeignKey(
        DESIGNATION, 
        null=True,  # Add this
        blank=True,  # Add this
        on_delete=models.PROTECT, 
        db_column='DESIGNATION_ID',
        related_name='users'
    )
    PHONE_NUMBER = models.CharField(max_length=15, null=True, blank=True, db_column='PHONE_NUMBER')
    PROFILE_PICTURE = models.ImageField(upload_to='profile_pics/', null=True, blank=True, db_column='PROFILE_PICTURE')

    # Status fields
    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')
    IS_STAFF = models.BooleanField(default=False, db_column='IS_STAFF')
    IS_SUPERUSER = models.BooleanField(default=False, db_column='IS_SUPERUSER')
    IS_EMAIL_VERIFIED = models.BooleanField(default=False, db_column='IS_EMAIL_VERIFIED')
    
    # Timestamps
    CREATED_AT = models.DateTimeField(
        auto_now_add=True, 
        db_column='CREATED_AT'
    )
    UPDATED_AT = models.DateTimeField(
        auto_now=True, 
        db_column='UPDATED_AT'
    )
    LAST_LOGIN = models.DateTimeField(null=True, blank=True, db_column='LAST_LOGIN')
    DATE_JOINED = models.DateTimeField(
        default=timezone.now,  # Change from auto_now_add to default
        db_column='DATE_JOINED'
    )

    # Security and Login tracking fields
    LAST_LOGIN_IP = models.GenericIPAddressField(null=True, blank=True, db_column='LAST_LOGIN_IP')
    LAST_LOGIN_ATTEMPT = models.DateTimeField(null=True, blank=True, db_column='LAST_LOGIN_ATTEMPT')
    LAST_FAILED_LOGIN = models.DateTimeField(null=True, blank=True, db_column='LAST_FAILED_LOGIN')  # Add this field
    FAILED_LOGIN_ATTEMPTS = models.IntegerField(default=0, db_column='FAILED_LOGIN_ATTEMPTS')
    IS_LOCKED = models.BooleanField(default=False, db_column='IS_LOCKED')
    LOCKED_UNTIL = models.DateTimeField(null=True, blank=True, db_column='LOCKED_UNTIL')
    PASSWORD_CHANGED_AT = models.DateTimeField(null=True, blank=True, db_column='PASSWORD_CHANGED_AT')
    PERMANENT_LOCK = models.BooleanField(default=False, db_column='PERMANENT_LOCK')
    LOCK_REASON = models.CharField(max_length=255, null=True, blank=True, db_column='LOCK_REASON')
    
    # OTP related fields
    OTP_SECRET = models.CharField(max_length=16, null=True, blank=True, db_column='OTP_SECRET')
    OTP_CREATED_AT = models.DateTimeField(null=True, blank=True, db_column='OTP_CREATED_AT')
    OTP_ATTEMPTS = models.IntegerField(default=0, db_column='OTP_ATTEMPTS')
    OTP_VERIFIED = models.BooleanField(default=False, db_column='OTP_VERIFIED')
    MAX_OTP_TRY = models.IntegerField(default=3, db_column='MAX_OTP_TRY')
    OTP_BLOCKED_UNTIL = models.DateTimeField(null=True, blank=True, db_column='OTP_BLOCKED_UNTIL')
    OTP_EXPIRY = models.DateTimeField(null=True, blank=True)  # Add this field

    objects = CustomUserManager()

    class Meta:
        db_table = 'USERS'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['USER_ID']

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self.IS_ACTIVE

    @is_active.setter
    def is_active(self, value):
        self.IS_ACTIVE = value

    @property
    def is_staff(self):
        return self.IS_STAFF

    @property
    def is_superuser(self):
        return self.IS_SUPERUSER

    @property
    def is_email_verified(self):
        return self.IS_EMAIL_VERIFIED

    @property
    def username(self):
        return self.USERNAME

    @property
    def email(self):
        return self.EMAIL

    @property
    def first_name(self):
        return self.FIRST_NAME

    @property
    def last_name(self):
        return self.LAST_NAME

    @property
    def password(self):
        return self.PASSWORD

    @password.setter
    def password(self, value):
        self.PASSWORD = value

    def get_username(self):
        return self.USERNAME

    def check_password_history(self, raw_password):
        """Check if password exists in user's password history"""
        for history in self.password_history.all()[:5]:
            if check_password(raw_password, history.PASSWORD):
                return False
        return True

    def set_password(self, raw_password):
        """Override set_password to include password history"""
        if not raw_password:
            return

        if self.pk and not self.check_password_history(raw_password):
            raise ValueError("Cannot reuse any of your last 5 passwords")

        self.PASSWORD = make_password(raw_password)
        
        if self.pk:
            PASSWORD_HISTORY.objects.create(
                USER=self,
                PASSWORD=self.PASSWORD
            )
            
            # Keep only last 5 passwords
            old_passwords = self.password_history.all()[5:]
            for old_password in old_passwords:
                old_password.delete()

        self.PASSWORD_CHANGED_AT = timezone.now()
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.PASSWORD)

    def get_session_auth_hash(self):
        """
        Override to use our PASSWORD field instead of password
        """
        return self.PASSWORD

    def has_perm(self, perm, obj=None):
        return self.IS_SUPERUSER

    def has_module_perms(self, app_label):
        return self.IS_SUPERUSER

    def increment_failed_attempts(self):
        self.FAILED_LOGIN_ATTEMPTS = (self.FAILED_LOGIN_ATTEMPTS or 0) + 1
        self.LAST_FAILED_LOGIN = timezone.now()
        
        # Update lock status based on attempts
        if self.FAILED_LOGIN_ATTEMPTS >= 8:
            self.PERMANENT_LOCK = True
            self.LOCK_REASON = "Too many failed login attempts (8+). Administrative unlock required."
        elif self.FAILED_LOGIN_ATTEMPTS >= 5:
            self.LOCKED_UNTIL = timezone.now() + timezone.timedelta(hours=6)
        elif self.FAILED_LOGIN_ATTEMPTS >= 3:
            self.LOCKED_UNTIL = timezone.now() + timezone.timedelta(hours=1)
            
        self.save(update_fields=[
            'FAILED_LOGIN_ATTEMPTS', 
            'LAST_FAILED_LOGIN',
            'PERMANENT_LOCK',
            'LOCK_REASON',
            'LOCKED_UNTIL'
        ])

    def reset_failed_attempts(self):
        if self.PERMANENT_LOCK:
            return False  # Can't reset if permanently locked
            
        self.FAILED_LOGIN_ATTEMPTS = 0
        self.LAST_FAILED_LOGIN = None
        self.LOCKED_UNTIL = None
        self.save(update_fields=[
            'FAILED_LOGIN_ATTEMPTS',
            'LAST_FAILED_LOGIN',
            'LOCKED_UNTIL'
        ])
        return True

    def is_account_locked(self):
        """
        Check account lock status with different conditions:
        - 3 failed attempts: 1 hour lock
        - 5 failed attempts: 6 hours lock
        - 8 or more attempts: permanent lock (admin unlock required)
        """
        if self.PERMANENT_LOCK:
            return True, "Account is permanently locked. Please contact administrator."

        if not self.FAILED_LOGIN_ATTEMPTS or not self.LAST_FAILED_LOGIN:
            return False, "Account is not locked."

        current_time = timezone.now()

        # Check for permanent lock (8+ attempts)
        if self.FAILED_LOGIN_ATTEMPTS >= 8:
            self.PERMANENT_LOCK = True
            self.LOCK_REASON = "Too many failed login attempts (8+). Administrative unlock required."
            self.save(update_fields=['PERMANENT_LOCK', 'LOCK_REASON'])
            return True, "Account has been permanently locked due to too many failed attempts. Please contact administrator."

        # Check for 6-hour lock (5-7 attempts)
        if self.FAILED_LOGIN_ATTEMPTS >= 5:
            lock_duration = timezone.timedelta(hours=6)
            lock_end_time = self.LAST_FAILED_LOGIN + lock_duration
            if current_time < lock_end_time:
                remaining_time = lock_end_time - current_time
                hours = int(remaining_time.total_seconds() // 3600)
                minutes = int((remaining_time.total_seconds() % 3600) // 60)
                return True, f"Account is locked for {hours}h {minutes}m due to multiple failed attempts."

        # Check for 1-hour lock (3-4 attempts)
        if self.FAILED_LOGIN_ATTEMPTS >= 3:
            lock_duration = timezone.timedelta(hours=1)
            lock_end_time = self.LAST_FAILED_LOGIN + lock_duration
            if current_time < lock_end_time:
                remaining_time = lock_end_time - current_time
                minutes = int(remaining_time.total_seconds() // 60)
                return True, f"Account is locked for {minutes} minutes due to failed attempts."

        # Reset failed attempts if lock period has expired
        self.reset_failed_attempts()
        return False, "Account is not locked."

    def update_login_info(self, ip_address):
        self.LAST_LOGIN_IP = ip_address
        self.last_login = timezone.now()
        self.FAILED_LOGIN_ATTEMPTS = 0
        self.IS_LOCKED = False
        self.LOCKED_UNTIL = None
        self.save()

    def generate_otp(self):
        try:
            otp = ''.join(secrets.choice(string.digits) for _ in range(6))
            expiry = timezone.now() + timezone.timedelta(minutes=3)
            
            # Update both fields together
            CustomUser.objects.filter(pk=self.pk).update(
                OTP_SECRET=otp,
                OTP_EXPIRY=expiry,
                OTP_CREATED_AT=timezone.now(),  # Add this
                OTP_ATTEMPTS=0  # Reset attempts
            )
            
            # Update instance attributes
            self.OTP_SECRET = otp
            self.OTP_EXPIRY = expiry
            self.OTP_CREATED_AT = timezone.now()
            self.OTP_ATTEMPTS = 0
            
            return otp
        except Exception as e:
            print(f"OTP Generation error: {str(e)}")
            return None

    def verify_otp(self, otp, clear_on_success=False):
        print(f"Verifying OTP for user {self.USER_ID}")
        print(f"Input OTP: {otp}")
        print(f"Stored OTP: {self.OTP_SECRET}")
        print(f"OTP Expiry: {self.OTP_EXPIRY}")
        print(f"Current time: {timezone.now()}")
        
        try:
            if not self.OTP_SECRET or not self.OTP_EXPIRY:
                return False, "No valid OTP found"

            if timezone.now() > self.OTP_EXPIRY:
                self.OTP_SECRET = None
                self.OTP_EXPIRY = None
                self.save()
                return False, "OTP has expired"

            if self.OTP_ATTEMPTS >= self.MAX_OTP_TRY:
                return False, "Too many attempts. Please request a new OTP"

            if otp != self.OTP_SECRET:
                self.OTP_ATTEMPTS += 1
                self.save()
                return False, "Invalid OTP"

            # Only clear OTP if clear_on_success is True
            if clear_on_success:
                self.OTP_SECRET = None
                self.OTP_EXPIRY = None
            
            self.OTP_VERIFIED = True
            self.OTP_ATTEMPTS = 0
            self.save()
            
            return True, "OTP verified successfully"
            
        except Exception as e:
            print(f"OTP verification error: {str(e)}")
            return False, "Error during OTP verification"

    def has_module_permission(self, module_name):
        """Check if user has permission for a module based on designation"""
        if self.IS_SUPERUSER:
            return True
        return self.DESIGNATION.PERMISSIONS.get(module_name, {}).get('access', False)

    def has_action_permission(self, module_name, action):
        """Check if user has permission for specific action in a module"""
        if self.IS_SUPERUSER:
            return True
        return self.DESIGNATION.PERMISSIONS.get(module_name, {}).get(action, False)

    @classmethod
    def get_email_field_name(cls):
        return cls.EMAIL_FIELD

    def save(self, *args, **kwargs):
        if self.pk:  # If this is an update
            try:
                # Get the old instance if it exists
                old_instance = self.__class__.objects.filter(pk=self.pk).first()
                if old_instance:
                    # Fix: Use FAILED_LOGIN_ATTEMPTS instead of FAILED_ATTEMPTS
                    self.FAILED_LOGIN_ATTEMPTS = old_instance.FAILED_LOGIN_ATTEMPTS
                    self.LAST_LOGIN_ATTEMPT = old_instance.LAST_LOGIN_ATTEMPT
            except self.__class__.DoesNotExist:
                pass  # This is a new instance
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        USER_HISTORY.objects.create(
            USER=self,
            ACTION='DELETE',
            ACTION_BY=self.DELETED_BY or self.UPDATED_BY,
            OLD_DATA={
                'USERNAME': self.USERNAME,
                'EMAIL': self.EMAIL,
                'FIRST_NAME': self.FIRST_NAME,
                'LAST_NAME': self.LAST_NAME,
                'DESIGNATION_ID': str(self.DESIGNATION.DESIGNATION_ID),
                'IS_ACTIVE': self.IS_ACTIVE,
                'IS_STAFF': self.IS_STAFF,
                'IS_SUPERUSER': self.IS_SUPERUSER,
                'IS_EMAIL_VERIFIED': self.IS_EMAIL_VERIFIED
            }
        )
        super().delete(*args, **kwargs)

