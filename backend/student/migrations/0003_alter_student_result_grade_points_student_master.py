# Generated by Django 4.2.7 on 2025-03-25 07:15

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0021_merge_20250323_2107'),
        ('student', '0002_alter_student_created_by_alter_student_deleted_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student_result',
            name='GRADE_POINTS',
            field=models.DecimalField(db_column='GRADE_POINTS', decimal_places=1, max_digits=10),
        ),
        migrations.CreateModel(
            name='STUDENT_MASTER',
            fields=[
                ('CREATED_BY', models.CharField(blank=True, db_column='CREATED_BY', max_length=50, null=True)),
                ('CREATED_AT', models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')),
                ('UPDATED_BY', models.CharField(blank=True, db_column='UPDATED_BY', max_length=50, null=True)),
                ('UPDATED_AT', models.DateTimeField(auto_now=True, db_column='UPDATED_AT')),
                ('DELETED_BY', models.CharField(blank=True, db_column='DELETED_BY', max_length=50, null=True)),
                ('DELETED_AT', models.DateTimeField(blank=True, db_column='DELETED_AT', null=True)),
                ('IS_DELETED', models.BooleanField(db_column='IS_DELETED', default=False)),
                ('RECORD_ID', models.AutoField(db_column='RECORD_ID', primary_key=True, serialize=False)),
                ('STUDENT_ID', models.CharField(db_column='STUDENT_ID', max_length=20, unique=True)),
                ('INSTITUTE', models.CharField(db_column='INSTITUTE_CODE', max_length=20)),
                ('ACADEMIC_YEAR', models.CharField(db_column='ACADEMIC_YEAR', max_length=10)),
                ('BATCH', models.CharField(db_column='BATCH', help_text='Expected graduation/passout year (e.g., 2025)', max_length=4)),
                ('ADMISSION_CATEGORY', models.CharField(db_column='ADMISSION_CATEGORY', max_length=20)),
                ('FORM_NO', models.IntegerField(db_column='FORM_NO')),
                ('VALIDITY', models.DateField(db_column='VALIDITY', default=django.utils.timezone.now)),
                ('NAME_ON_CERTIFICATE', models.CharField(blank=True, db_column='NAME_ON_CERTIFICATE', default='', max_length=100)),
                ('NAME', models.CharField(db_column='NAME', max_length=100)),
                ('SURNAME', models.CharField(db_column='SURNAME', max_length=100)),
                ('PARENT_NAME', models.CharField(db_column='PARENT_NAME', default='', max_length=100)),
                ('MOTHER_NAME', models.CharField(blank=True, db_column='MOTHER_NAME', default='', max_length=100)),
                ('FATHER_NAME', models.CharField(db_column='FATHER_NAME', default='', max_length=100)),
                ('GENDER', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], db_column='GENDER', max_length=10)),
                ('DOB', models.DateField(db_column='DOB')),
                ('DOP', models.DateField(blank=True, db_column='DOP', null=True)),
                ('PER_ADDRESS', models.TextField(blank=True, db_column='PER_ADDRESS', default='')),
                ('LOC_ADDRESS', models.TextField(blank=True, db_column='LOC_ADDRESS', default='')),
                ('PER_STATE_ID', models.IntegerField(db_column='PER_STATE_ID', default=1)),
                ('LOC_STATE_ID', models.IntegerField(db_column='LOC_STATE_ID', default=1)),
                ('PER_PHONE_NO', models.CharField(blank=True, db_column='PER_PHONE_NO', default='', max_length=15)),
                ('LOC_PHONE_NO', models.CharField(blank=True, db_column='LOC_PHONE_NO', default='', max_length=15)),
                ('MOB_NO', models.CharField(db_column='MOB_NO', max_length=15)),
                ('EMAIL_ID', models.EmailField(db_column='EMAIL_ID', max_length=254)),
                ('PER_CITY', models.CharField(blank=True, db_column='PER_CITY', default='', max_length=50)),
                ('LOC_CITY', models.CharField(blank=True, db_column='LOC_CITY', default='', max_length=50)),
                ('NATIONALITY', models.CharField(db_column='NATIONALITY', default='INDIAN', max_length=50)),
                ('BLOOD_GR', models.CharField(db_column='BLOOD_GR', default='O+', max_length=5)),
                ('CASTE', models.CharField(db_column='CASTE', default='GENERAL', max_length=50)),
                ('ENROLMENT_NO', models.CharField(blank=True, db_column='ENROLMENT_NO', default='', max_length=20)),
                ('IS_ACTIVE', models.CharField(db_column='IS_ACTIVE', default='YES', max_length=8)),
                ('HANDICAPPED', models.CharField(db_column='HANDICAPPED', default='NO', max_length=10)),
                ('MARK_ID', models.CharField(blank=True, db_column='MARK_ID', default='0', max_length=20)),
                ('ADMISSION_DATE', models.DateField(db_column='ADMISSION_DATE', default=django.utils.timezone.now)),
                ('QUOTA_ID', models.IntegerField(db_column='QUOTA_ID', default=1)),
                ('PER_PIN', models.CharField(blank=True, db_column='PER_PIN', default='', max_length=6)),
                ('LOC_PIN', models.CharField(blank=True, db_column='LOC_PIN', default='', max_length=6)),
                ('YEAR_SEM_ID', models.IntegerField(db_column='YEAR_SEM_ID', default=1)),
                ('DATE_LEAVING', models.DateField(blank=True, db_column='DATE_LEAVING', null=True)),
                ('RELIGION', models.CharField(blank=True, db_column='RELIGION', default='', max_length=50)),
                ('DOB_WORD', models.CharField(blank=True, db_column='DOB_WORD', default='', max_length=100)),
                ('ADMN_ROUND', models.CharField(db_column='ADMN_ROUND', default='1', max_length=10)),
                ('BANK_NAME', models.CharField(blank=True, db_column='BANK_NAME', default='', max_length=100)),
                ('BANK_ACC_NO', models.CharField(blank=True, db_column='BANK_ACC_NO', default='', max_length=20)),
                ('EMERGENCY_NO', models.CharField(blank=True, db_column='EMERGENCY_NO', default='', max_length=15)),
                ('PER_TALUKA', models.CharField(blank=True, db_column='PER_TALUKA', default='', max_length=50)),
                ('PER_DIST', models.CharField(blank=True, db_column='PER_DIST', default='', max_length=50)),
                ('LOC_TALUKA', models.CharField(blank=True, db_column='LOC_TALUKA', default='', max_length=50)),
                ('LOC_DIST', models.CharField(blank=True, db_column='LOC_DIST', default='', max_length=50)),
                ('EDITPERSON', models.CharField(db_column='EDITPERSON', default='SYSTEM', max_length=100)),
                ('ADMN_QUOTA_ID', models.IntegerField(db_column='ADMN_QUOTA_ID', default=0)),
                ('STATUS', models.CharField(db_column='STATUS', default='ACTIVE', max_length=20)),
                ('JOINING_STATUS', models.CharField(db_column='JOINING_STATUS', default='JOINED', max_length=20)),
                ('REGISTRATION_DATE', models.DateField(db_column='REGISTRATION_DATE', default=django.utils.timezone.now)),
                ('LATERAL_STATUS', models.CharField(db_column='LATERAL_STATUS', default='NO', max_length=20)),
                ('JOINING_STATUS_DATE', models.DateField(db_column='JOINING_STATUS_DATE', default=django.utils.timezone.now)),
                ('RETENTION_STATUS_DATE', models.DateField(db_column='RETENTION_STATUS_DATE', default=django.utils.timezone.now)),
                ('BRANCH_ID', models.ForeignKey(db_column='BRANCH_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.branch')),
            ],
            options={
                'verbose_name': 'Student Master',
                'verbose_name_plural': 'Student Masters',
                'db_table': '"STUDENT"."STUDENT_MASTER"',
                'indexes': [models.Index(fields=['STUDENT_ID'], name='STUDENT_MAS_STUDENT_d6572a_idx'), models.Index(fields=['EMAIL_ID'], name='STUDENT_MAS_EMAIL_I_635c12_idx'), models.Index(fields=['MOB_NO'], name='STUDENT_MAS_MOB_NO_ab0b9c_idx')],
            },
        ),
    ]
