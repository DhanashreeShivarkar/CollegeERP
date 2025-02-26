from django.db import models
from core.models import AuditModel

class TYPE_MASTER(AuditModel):
    ID = models.AutoField(primary_key=True, db_column='ID')
    RECORD_WORD = models.CharField(max_length=100, db_column='RECORD_WORD')

    class Meta:
        db_table = '"ESTABLISHMENT"."TYPE_MASTER"'
        verbose_name = 'Type Master'
        verbose_name_plural = 'Type Masters'

    def __str__(self):
        return f"{self.ID} - {self.RECORD_WORD}"

class STATUS_MASTER(AuditModel):
    ID = models.AutoField(primary_key=True, db_column='ID')
    RECORD_WORD = models.CharField(max_length=100, db_column='RECORD_WORD')

    class Meta:
        db_table = '"ESTABLISHMENT"."STATUS_MASTER"'
        verbose_name = 'Status Master'
        verbose_name_plural = 'Status Masters'

    def __str__(self):
        return f"{self.ID} - {self.RECORD_WORD}"

class SHIFT_MASTER(AuditModel):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SHIFT_NAME = models.CharField(max_length=50, db_column='SHIFT_NAME')
    FROM_TIME = models.TimeField(db_column='FROM_TIME')
    TO_TIME = models.TimeField(db_column='TO_TIME')

    LATE_COMING_TIME = models.TimeField(null=True, blank=True, db_column='LATE_COMING_TIME')
    EARLY_GOING_TIME = models.TimeField(null=True, blank=True, db_column='EARLY_GOING_TIME')

    class Meta:
        db_table = '"ESTABLISHMENT"."SHIFT_MASTER"'
        verbose_name = 'Shift Master'
        verbose_name_plural = 'Shift Masters'

    def __str__(self):
        return f"{self.ID} - {self.SHIFT_NAME}"