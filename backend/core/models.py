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
    CREATED_BY = models.CharField(
        max_length=50,
        db_column='CREATED_BY',
        null=True, 
        blank=True 
    )
    CREATED_AT = models.DateTimeField(
        auto_now_add=True,
        db_column='CREATED_AT'
    )
    UPDATED_BY = models.CharField(
        max_length=50,
        db_column='UPDATED_BY',
        null=True, 
        blank=True 
    )
    UPDATED_AT = models.DateTimeField(
        auto_now=True,
        db_column='UPDATED_AT'
    )
    DELETED_BY = models.CharField(  # Changed from ForeignKey to CharField
        max_length=50,
        null=True,
        blank=True,
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

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        if not self.pk and not self.CREATED_BY:  # Only set if not already set
            self.CREATED_BY = 'system'
            self.CREATED_AT = timezone.now()
        
        if not self.UPDATED_BY:  # Only set if not already set
            self.UPDATED_BY = 'system'
        self.UPDATED_AT = timezone.now()

        if self.IS_DELETED and not self.DELETED_AT:
            self.DELETED_BY = self.UPDATED_BY or 'system'
            self.DELETED_AT = timezone.now()

        super().save(force_insert=force_insert, force_update=force_update, *args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        """Soft delete the instance"""
        self.IS_DELETED = True
        self.save(using=using)

    def hard_delete(self, using=None, keep_parents=False):
        """Actually delete the instance from the database"""
        super().delete(using=using, keep_parents=keep_parents)

    class Meta:
        abstract = True
