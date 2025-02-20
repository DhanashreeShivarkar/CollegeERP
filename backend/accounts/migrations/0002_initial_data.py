from django.db import migrations
from django.utils import timezone

def add_initial_data(apps, schema_editor):
    DESIGNATION = apps.get_model('accounts', 'DESIGNATION')
    UNIVERSITY = apps.get_model('accounts', 'UNIVERSITY')
    INSTITUTE = apps.get_model('accounts', 'INSTITUTE')
    PROGRAM = apps.get_model('accounts', 'PROGRAM')
    BRANCH = apps.get_model('accounts', 'BRANCH')

    # Create Designations
    superadmin = DESIGNATION.objects.create(
        NAME='Super Admin',
        CODE='SUPERADMIN',
        DESCRIPTION='Full system access with all privileges',
        PERMISSIONS={
            'all_modules': {
                'read': True,
                'create': True,
                'update': True,
                'delete': True,
                'approve': True,
                'reject': True
            }
        },
        IS_ACTIVE=True,
        CREATED_AT=timezone.now(),
        UPDATED_AT=timezone.now()
    )

    admin = DESIGNATION.objects.create(
        NAME='Admin',
        CODE='ADMIN',
        DESCRIPTION='System administration with limited privileges',
        PERMISSIONS={
            'all_modules': {
                'read': True,
                'create': True,
                'update': True,
                'delete': False,
                'approve': False,
                'reject': False
            }
        },
        IS_ACTIVE=True,
        CREATED_AT=timezone.now(),
        UPDATED_AT=timezone.now()
    )

    # Create University
    university = UNIVERSITY.objects.create(
        NAME="Savitribai Phule Pune University",
        CODE="SPPU",
        ADDRESS="Ganeshkhind, Pune, Maharashtra 411007",
        CONTACT_NUMBER="020-25601182",
        EMAIL="registrar@unipune.ac.in",
        WEBSITE="www.unipune.ac.in",
        ESTD_YEAR=1949,
        IS_ACTIVE=True,
        CREATED_AT=timezone.now(),
        UPDATED_AT=timezone.now()
    )

    # Create Institute
    institute = INSTITUTE.objects.create(
        UNIVERSITY=university,
        NAME="College of Engineering, Pune",
        CODE="COEP",
        ADDRESS="Wellesley Road, Shivajinagar, Pune, Maharashtra 411005",
        CONTACT_NUMBER="020-25507000",
        EMAIL="director@coep.ac.in",
        WEBSITE="www.coep.org.in",
        ESTD_YEAR=1854,
        IS_ACTIVE=True,
        CREATED_AT=timezone.now(),
        UPDATED_AT=timezone.now()
    )

    # Create Programs
    programs = {
        'BTech': {'level': 'UG', 'years': 4},
        'MTech': {'level': 'PG', 'years': 2},
        'Diploma': {'level': 'DIP', 'years': 3},
    }

    for prog_name, details in programs.items():
        program = PROGRAM.objects.create(
            INSTITUTE=institute,
            NAME=f"{prog_name}",
            CODE=prog_name.upper(),
            DURATION_YEARS=details['years'],
            LEVEL=details['level'],
            TYPE='FT',
            IS_ACTIVE=True,
            CREATED_AT=timezone.now(),
            UPDATED_AT=timezone.now()
        )

        # Create Branches for each program
        branches = {
            'CSE': 'Computer Science and Engineering',
            'ME': 'Mechanical Engineering',
            'EE': 'Electrical Engineering',
            'CE': 'Civil Engineering'
        }

        for branch_code, branch_name in branches.items():
            BRANCH.objects.create(
                PROGRAM=program,
                NAME=branch_name,
                CODE=f"{prog_name[:2]}{branch_code}",
                IS_ACTIVE=True,
                CREATED_AT=timezone.now(),
                UPDATED_AT=timezone.now()
            )

def remove_initial_data(apps, schema_editor):
    # Remove in reverse order to handle foreign key constraints
    BRANCH = apps.get_model('accounts', 'BRANCH')
    PROGRAM = apps.get_model('accounts', 'PROGRAM')
    INSTITUTE = apps.get_model('accounts', 'INSTITUTE')
    UNIVERSITY = apps.get_model('accounts', 'UNIVERSITY')

    BRANCH.objects.all().delete()
    PROGRAM.objects.all().delete()
    INSTITUTE.objects.all().delete()
    UNIVERSITY.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial_data, remove_initial_data),
    ]
