from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

class SchemaModel(models.Model):
    class Meta:
        abstract = True

class AuditModel(SchemaModel):
    """
    Abstract base class for audit fields that can be inherited by any model
    """
    CREATED_BY = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_created',
        db_column='CREATED_BY',
        null=True, 
        blank=True 
    )
    CREATED_AT = models.DateTimeField(
        auto_now_add=True,
        db_column='CREATED_AT'
    )
    UPDATED_BY = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_updated',
        db_column='UPDATED_BY',
        null=True, 
        blank=True 
    )
    UPDATED_AT = models.DateTimeField(
        auto_now=True,
        db_column='UPDATED_AT'
    )
    DELETED_BY = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='%(class)s_deleted',
        db_column='DELETED_BY'
    )
    DELETED_AT = models.DateTimeField(
        null=True,
        blank=True,
        db_column='DELETED_AT'
    )
    IS_DELETED = models.BooleanField(
        default=False,
        db_column='IS_DELETED'
    )

    def save(self, *args, **kwargs):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        request = getattr(self, 'request', None)
        if request and hasattr(request, '_audit_user'):
            user = request._audit_user
        else:
            # Get the system user for automated operations
            user = User.objects.filter(USERNAME='system').first()
            if not user:
                user = User.objects.create(
                    USER_ID='SYSTEM',
                    USERNAME='system',
                    EMAIL='system@example.com',
                    IS_ACTIVE=True,
                    IS_STAFF=True,
                    IS_SUPERUSER=True
                )

        if not self.pk:  # New instance
            self.CREATED_BY = user
            self.CREATED_AT = timezone.now()
        
        self.UPDATED_BY = user
        self.UPDATED_AT = timezone.now()

        if self.IS_DELETED and not self.DELETED_AT:
            self.DELETED_BY = user
            self.DELETED_AT = timezone.now()

        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        """Soft delete the instance"""
        self.IS_DELETED = True
        self.save(using=using)

    def hard_delete(self, using=None, keep_parents=False):
        """Actually delete the instance from the database"""
        super().delete(using=using, keep_parents=keep_parents)

    class Meta:
        abstract = True
