from django.db import models
from core.models import AuditModel
from accounts.models import BRANCH, PROGRAM
from academic.models import ACADEMIC_YEAR, EXAMINATION, CURRICULUM

class STUDENT(AuditModel):
    STUDENT_ID = models.AutoField(primary_key=True, db_column='STUDENT_ID')
    ENROLLMENT_NO = models.CharField(max_length=20, unique=True, db_column='ENROLLMENT_NO')
    FIRST_NAME = models.CharField(max_length=50, db_column='FIRST_NAME')
    MIDDLE_NAME = models.CharField(max_length=50, null=True, blank=True, db_column='MIDDLE_NAME')
    LAST_NAME = models.CharField(max_length=50, db_column='LAST_NAME')
    DATE_OF_BIRTH = models.DateField(db_column='DATE_OF_BIRTH')
    GENDER = models.CharField(
        max_length=1,
        choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')],
        db_column='GENDER'
    )
    EMAIL = models.EmailField(unique=True, db_column='EMAIL')
    PHONE = models.CharField(max_length=15, db_column='PHONE')
    ADDRESS = models.TextField(db_column='ADDRESS')
    CITY = models.CharField(max_length=50, db_column='CITY')
    STATE = models.CharField(max_length=50, db_column='STATE')
    PINCODE = models.CharField(max_length=6, db_column='PINCODE')
    BLOOD_GROUP = models.CharField(max_length=5, db_column='BLOOD_GROUP')
    PHOTO = models.ImageField(upload_to='student_photos/', null=True, blank=True, db_column='PHOTO')
    
    # Academic Details
    BRANCH = models.ForeignKey(BRANCH, on_delete=models.PROTECT, db_column='BRANCH_ID')
    PROGRAM = models.ForeignKey(PROGRAM, on_delete=models.PROTECT, db_column='PROGRAM_ID')
    ACADEMIC_YEAR = models.ForeignKey(ACADEMIC_YEAR, on_delete=models.PROTECT, db_column='ACADEMIC_YEAR_ID')
    CURRENT_SEMESTER = models.IntegerField(db_column='CURRENT_SEMESTER')
    ADMISSION_DATE = models.DateField(db_column='ADMISSION_DATE')
    
    # Status
    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')

    class Meta:
        db_table = '"STUDENT"."STUDENTS"'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def __str__(self):
        return f"{self.ENROLLMENT_NO} - {self.FIRST_NAME} {self.LAST_NAME}"

class STUDENT_PARENT(AuditModel):
    PARENT_ID = models.AutoField(primary_key=True, db_column='PARENT_ID')
    STUDENT = models.ForeignKey(STUDENT, on_delete=models.CASCADE, db_column='STUDENT_ID')
    RELATION = models.CharField(
        max_length=10,
        choices=[('FATHER', 'Father'), ('MOTHER', 'Mother'), ('GUARDIAN', 'Guardian')],
        db_column='RELATION'
    )
    FIRST_NAME = models.CharField(max_length=50, db_column='FIRST_NAME')
    MIDDLE_NAME = models.CharField(max_length=50, null=True, blank=True, db_column='MIDDLE_NAME')
    LAST_NAME = models.CharField(max_length=50, db_column='LAST_NAME')
    OCCUPATION = models.CharField(max_length=100, db_column='OCCUPATION')
    EMAIL = models.EmailField(db_column='EMAIL')
    PHONE = models.CharField(max_length=15, db_column='PHONE')
    ANNUAL_INCOME = models.DecimalField(max_digits=12, decimal_places=2, db_column='ANNUAL_INCOME')
    IS_ACTIVE = models.BooleanField(default=True, db_column='IS_ACTIVE')

    class Meta:
        db_table = '"STUDENT"."STUDENT_PARENTS"'
        verbose_name = 'Student Parent'
        verbose_name_plural = 'Student Parents'
        unique_together = ['STUDENT', 'RELATION']

    def __str__(self):
        return f"{self.STUDENT.ENROLLMENT_NO} - {self.RELATION} - {self.FIRST_NAME}"

class STUDENT_ACADEMIC(AuditModel):
    ACADEMIC_ID = models.AutoField(primary_key=True, db_column='ACADEMIC_ID')
    STUDENT = models.ForeignKey(STUDENT, on_delete=models.CASCADE, db_column='STUDENT_ID')
    QUALIFICATION = models.CharField(max_length=50, db_column='QUALIFICATION')  # e.g., "10th", "12th", "BTech"
    BOARD_UNIVERSITY = models.CharField(max_length=100, db_column='BOARD_UNIVERSITY')
    INSTITUTION = models.CharField(max_length=200, db_column='INSTITUTION')
    YEAR_OF_PASSING = models.IntegerField(db_column='YEAR_OF_PASSING')
    PERCENTAGE = models.DecimalField(max_digits=5, decimal_places=2, db_column='PERCENTAGE')
    DIVISION = models.CharField(max_length=20, db_column='DIVISION')  # First, Second, Third
    SUBJECTS = models.JSONField(db_column='SUBJECTS')  # Store subjects as JSON
    DOCUMENTS = models.JSONField(db_column='DOCUMENTS', null=True, blank=True)  # Store document URLs
    IS_VERIFIED = models.BooleanField(default=False, db_column='IS_VERIFIED')

    class Meta:
        db_table = '"STUDENT"."STUDENT_ACADEMICS"'
        verbose_name = 'Student Academic'
        verbose_name_plural = 'Student Academics'
        unique_together = ['STUDENT', 'QUALIFICATION']

    def __str__(self):
        return f"{self.STUDENT.ENROLLMENT_NO} - {self.QUALIFICATION}"

class STUDENT_RESULT(AuditModel):
    RESULT_ID = models.AutoField(primary_key=True, db_column='RESULT_ID')
    STUDENT = models.ForeignKey(STUDENT, on_delete=models.CASCADE, db_column='STUDENT_ID')
    CURRICULUM = models.ForeignKey(CURRICULUM, on_delete=models.PROTECT, db_column='CURRICULUM_ID')
    EXAMINATION = models.ForeignKey(EXAMINATION, on_delete=models.PROTECT, db_column='EXAMINATION_ID')
    MARKS_OBTAINED = models.DecimalField(max_digits=5, decimal_places=2, db_column='MARKS_OBTAINED')
    IS_PASS = models.BooleanField(db_column='IS_PASS')
    GRADE = models.CharField(max_length=2, db_column='GRADE')
    GRADE_POINTS = models.DecimalField(max_digits=3, decimal_places=1, db_column='GRADE_POINTS')
    ATTEMPT_NUMBER = models.IntegerField(default=1, db_column='ATTEMPT_NUMBER')
    REMARKS = models.CharField(max_length=255, null=True, blank=True, db_column='REMARKS')
    IS_VERIFIED = models.BooleanField(default=False, db_column='IS_VERIFIED')

    class Meta:
        db_table = '"STUDENT"."STUDENT_RESULTS"'
        verbose_name = 'Student Result'
        verbose_name_plural = 'Student Results'
        unique_together = ['STUDENT', 'CURRICULUM', 'EXAMINATION', 'ATTEMPT_NUMBER']

    def __str__(self):
        return f"{self.STUDENT.ENROLLMENT_NO} - {self.CURRICULUM.COURSE.CODE} - {self.EXAMINATION.NAME}"
