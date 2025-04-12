from django.db import models
from core.models import AuditModel

class COLLEGE_EXAM_TYPE(AuditModel):
    RECORD_ID = models.AutoField(primary_key=True, db_column='RECORD_ID')
    ACADEMIC_YEAR = models.CharField(max_length=10, db_column='ACADEMIC_YEAR', null=False)
    PROGRAM_ID = models.IntegerField(db_column='PROGRAM_ID', null=False)
    EXAM_TYPE = models.CharField(max_length=50, db_column='EXAM_TYPE', null=False)

    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')
    CREATED_BY = models.CharField(max_length=50, db_column='CREATED_BY', default='system')
    UPDATED_BY = models.CharField(max_length=50, db_column='UPDATED_BY', default='system')

    class Meta:
        db_table = '"EXAM"."COLLEGE_EXAM_TYPE"'
        verbose_name = 'College Exam Type'
        verbose_name_plural = 'College Exam Types'

    def __str__(self):
        return f"{self.EXAM_TYPE} ({self.ACADEMIC_YEAR})"