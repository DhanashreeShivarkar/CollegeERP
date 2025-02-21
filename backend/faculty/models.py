from django.db import models
from core.models import AuditModel
from accounts.models import BRANCH, PROGRAM, CustomUser

class FACULTY(AuditModel):
    FACULTY_ID = models.AutoField(primary_key=True, db_column='FACULTY_ID')
    USER = models.OneToOneField(CustomUser, on_delete=models.PROTECT, db_column='USER_ID')
    EMPLOYEE_ID = models.CharField(max_length=20, unique=True, db_column='EMPLOYEE_ID')
    BRANCH = models.ForeignKey(BRANCH, on_delete=models.PROTECT, db_column='BRANCH_ID')
    PROGRAM = models.ForeignKey(PROGRAM, on_delete=models.PROTECT, db_column='PROGRAM_ID')
    DATE_OF_JOINING = models.DateField(db_column='DATE_OF_JOINING')
    SPECIALIZATION = models.CharField(max_length=255, db_column='SPECIALIZATION')
    TEACHING_AREAS = models.JSONField(db_column='TEACHING_AREAS')
    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')

    class Meta:
        db_table = '"FACULTY"."FACULTY"'
        verbose_name = 'Faculty'
        verbose_name_plural = 'Faculty'

    def __str__(self):
        return f"{self.EMPLOYEE_ID} - {self.USER.FIRST_NAME} {self.USER.LAST_NAME}"

class FACULTY_QUALIFICATION(AuditModel):
    QUALIFICATION_ID = models.AutoField(primary_key=True, db_column='QUALIFICATION_ID')
    FACULTY = models.ForeignKey(FACULTY, on_delete=models.CASCADE, db_column='FACULTY_ID', related_name='qualifications')
    DEGREE = models.CharField(max_length=100, db_column='DEGREE')  # e.g., "PhD", "MTech", "BTech"
    SPECIALIZATION = models.CharField(max_length=255, db_column='SPECIALIZATION')
    UNIVERSITY = models.CharField(max_length=255, db_column='UNIVERSITY')
    YEAR_OF_PASSING = models.IntegerField(db_column='YEAR_OF_PASSING')
    PERCENTAGE = models.DecimalField(max_digits=5, decimal_places=2, db_column='PERCENTAGE')
    DOCUMENTS = models.JSONField(null=True, blank=True, db_column='DOCUMENTS')  # Store document URLs
    IS_VERIFIED = models.BooleanField(default=False, db_column='IS_VERIFIED')

    class Meta:
        db_table = '"FACULTY"."FACULTY_QUALIFICATIONS"'
        verbose_name = 'Faculty Qualification'
        verbose_name_plural = 'Faculty Qualifications'
        unique_together = ['FACULTY', 'DEGREE']

    def __str__(self):
        return f"{self.FACULTY.EMPLOYEE_ID} - {self.DEGREE}"

class FACULTY_EXPERIENCE(AuditModel):
    EXPERIENCE_ID = models.AutoField(primary_key=True, db_column='EXPERIENCE_ID')
    FACULTY = models.ForeignKey(FACULTY, on_delete=models.CASCADE, db_column='FACULTY_ID', related_name='experiences')
    ORGANIZATION = models.CharField(max_length=255, db_column='ORGANIZATION')
    DESIGNATION = models.CharField(max_length=100, db_column='DESIGNATION')
    START_DATE = models.DateField(db_column='START_DATE')
    END_DATE = models.DateField(null=True, blank=True, db_column='END_DATE')
    RESPONSIBILITIES = models.TextField(db_column='RESPONSIBILITIES')
    EXPERIENCE_TYPE = models.CharField(
        max_length=20,
        choices=[
            ('TEACHING', 'Teaching'),
            ('INDUSTRY', 'Industry'),
            ('RESEARCH', 'Research')
        ],
        db_column='EXPERIENCE_TYPE'
    )
    DOCUMENTS = models.JSONField(null=True, blank=True, db_column='DOCUMENTS')
    IS_VERIFIED = models.BooleanField(default=False, db_column='IS_VERIFIED')

    class Meta:
        db_table = '"FACULTY"."FACULTY_EXPERIENCE"'
        verbose_name = 'Faculty Experience'
        verbose_name_plural = 'Faculty Experiences'

    def __str__(self):
        return f"{self.FACULTY.EMPLOYEE_ID} - {self.ORGANIZATION} - {self.DESIGNATION}"

class FACULTY_RESEARCH(AuditModel):
    RESEARCH_ID = models.AutoField(primary_key=True, db_column='RESEARCH_ID')
    FACULTY = models.ForeignKey(FACULTY, on_delete=models.CASCADE, db_column='FACULTY_ID', related_name='research')
    RESEARCH_TYPE = models.CharField(
        max_length=20,
        choices=[
            ('PUBLICATION', 'Publication'),
            ('PATENT', 'Patent'),
            ('PROJECT', 'Project'),
            ('THESIS', 'Thesis'),
            ('BOOK', 'Book')
        ],
        db_column='RESEARCH_TYPE'
    )
    TITLE = models.CharField(max_length=500, db_column='TITLE')
    DESCRIPTION = models.TextField(db_column='DESCRIPTION')
    AUTHORS = models.JSONField(db_column='AUTHORS')  # List of authors/contributors
    PUBLICATION_DETAILS = models.JSONField(db_column='PUBLICATION_DETAILS')  # Journal/conference details
    YEAR = models.IntegerField(db_column='YEAR')
    STATUS = models.CharField(
        max_length=20,
        choices=[
            ('PUBLISHED', 'Published'),
            ('ACCEPTED', 'Accepted'),
            ('SUBMITTED', 'Submitted'),
            ('ONGOING', 'Ongoing'),
            ('COMPLETED', 'Completed')
        ],
        db_column='STATUS'
    )
    IMPACT_FACTOR = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True, db_column='IMPACT_FACTOR')
    CITATIONS = models.IntegerField(default=0, db_column='CITATIONS')
    DOI = models.CharField(max_length=100, null=True, blank=True, db_column='DOI')
    URL = models.URLField(null=True, blank=True, db_column='URL')
    DOCUMENTS = models.JSONField(null=True, blank=True, db_column='DOCUMENTS')
    IS_VERIFIED = models.BooleanField(default=False, db_column='IS_VERIFIED')

    class Meta:
        db_table = '"FACULTY"."FACULTY_RESEARCH"'
        verbose_name = 'Faculty Research'
        verbose_name_plural = 'Faculty Research'

    def __str__(self):
        return f"{self.FACULTY.EMPLOYEE_ID} - {self.RESEARCH_TYPE} - {self.TITLE[:50]}"
