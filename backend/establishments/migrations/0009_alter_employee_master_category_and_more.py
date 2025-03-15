# Generated by Django 4.2.19 on 2025-03-15 09:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_admission_quota_master_caste_master_quota_master_and_more'),
        ('establishments', '0008_alter_employee_master_category_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee_master',
            name='CATEGORY',
            field=models.ForeignKey(db_column='CATEGORY_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.category'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='DATE_OF_BIRTH',
            field=models.DateField(db_column='DATE_OF_BIRTH', default='2021-01-01'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='DATE_OF_JOIN',
            field=models.DateField(db_column='DATE_OF_JOIN', default='2021-01-01'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='DEPARTMENT',
            field=models.ForeignKey(db_column='DEPARTMENT_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.department'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='DESIGNATION',
            field=models.ForeignKey(db_column='DESIGNATION_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.designation'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='EMP_TYPE',
            field=models.ForeignKey(db_column='EMP_TYPE_ID', on_delete=django.db.models.deletion.PROTECT, related_name='employees_type', to='establishments.type_master'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='MARITAL_STATUS',
            field=models.CharField(choices=[('single', 'Single'), ('married', 'Married'), ('other', 'Other')], db_column='MARITAL_STATUS', max_length=10),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='MOBILE_NO',
            field=models.CharField(db_column='MOBILE_NO', default='0', max_length=15),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='PERMANENT_ADDRESS',
            field=models.TextField(db_column='PERMANENT_ADDRESS', default='NA'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='PERMANENT_CITY',
            field=models.CharField(db_column='PERMANENT_CITY', default='NA', max_length=50),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='PERMANENT_PIN',
            field=models.CharField(db_column='PERMANENT_PIN', default='NA', max_length=6),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='POSITION',
            field=models.CharField(db_column='POSITION', default='Employee', max_length=50),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='SHIFT',
            field=models.ForeignKey(db_column='SHIFT', on_delete=django.db.models.deletion.PROTECT, to='establishments.shift_master'),
        ),
        migrations.AlterField(
            model_name='employee_master',
            name='STATUS',
            field=models.ForeignKey(db_column='STATUS_ID', on_delete=django.db.models.deletion.PROTECT, related_name='employees_status', to='establishments.status_master'),
        ),
        migrations.CreateModel(
            name='EMPLOYEE_QUALIFICATION',
            fields=[
                ('CREATED_BY', models.CharField(blank=True, db_column='CREATED_BY', max_length=50, null=True)),
                ('CREATED_AT', models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')),
                ('UPDATED_BY', models.CharField(blank=True, db_column='UPDATED_BY', max_length=50, null=True)),
                ('UPDATED_AT', models.DateTimeField(auto_now=True, db_column='UPDATED_AT')),
                ('DELETED_BY', models.CharField(blank=True, db_column='DELETED_BY', max_length=50, null=True)),
                ('DELETED_AT', models.DateTimeField(blank=True, db_column='DELETED_AT', null=True)),
                ('IS_DELETED', models.BooleanField(db_column='IS_DELETED', default=False)),
                ('RECORD_ID', models.AutoField(db_column='RECORD_ID', primary_key=True, serialize=False)),
                ('ORDER_TYPE', models.CharField(db_column='ORDER_TYPE', max_length=20)),
                ('EMPLOYEE_TYPE', models.CharField(db_column='EMPLOYEE_TYPE', max_length=20)),
                ('JOINING_DATE_COLLEGE', models.DateField(blank=True, db_column='JOINING_DATE_COLLEGE', null=True)),
                ('JOINING_DATE_SANSTHA', models.DateField(blank=True, db_column='JOINING_DATE_SANSTHA', null=True)),
                ('DEGREE', models.CharField(db_column='DEGREE', max_length=50)),
                ('UNIVERSITY_BOARD', models.CharField(db_column='UNIVERSITY_BOARD', max_length=200)),
                ('COLLEGE_NAME', models.CharField(db_column='COLLEGE_NAME', max_length=200)),
                ('REGISTRATION_NUMBER', models.CharField(blank=True, db_column='REGISTRATION_NUMBER', max_length=50, null=True)),
                ('REGISTRATION_DATE', models.DateField(blank=True, db_column='REGISTRATION_DATE', null=True)),
                ('VALID_UPTO_DATE', models.DateField(blank=True, db_column='VALID_UPTO_DATE', null=True)),
                ('COUNCIL_NAME', models.CharField(blank=True, db_column='COUNCIL_NAME', max_length=200, null=True)),
                ('PASSING_DATE', models.DateField(db_column='PASSING_DATE')),
                ('SPECIALIZATION', models.CharField(blank=True, db_column='SPECIALIZATION', max_length=100, null=True)),
                ('PASSING_MONTH', models.CharField(db_column='PASSING_MONTH', max_length=20)),
                ('PASSING_YEAR', models.CharField(db_column='PASSING_YEAR', max_length=4)),
                ('TOTAL_MARKS', models.DecimalField(db_column='TOTAL_MARKS', decimal_places=2, max_digits=10)),
                ('OBTAINED_MARKS', models.DecimalField(db_column='OBTAINED_MARKS', decimal_places=2, max_digits=10)),
                ('PERCENTAGE', models.DecimalField(db_column='PERCENTAGE', decimal_places=2, max_digits=5)),
                ('DIVISION', models.CharField(db_column='DIVISION', max_length=20)),
                ('EMPLOYEE', models.ForeignKey(db_column='EMPLOYEE_ID', on_delete=django.db.models.deletion.CASCADE, related_name='qualifications', to='establishments.employee_master', to_field='EMPLOYEE_ID')),
            ],
            options={
                'db_table': '"ESTABLISHMENT"."EMPLOYEE_QUALIFICATION"',
                'ordering': ['EMPLOYEE', 'ORDER_TYPE'],
            },
        ),
    ]
