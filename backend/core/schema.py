from django.db import connection
from django.conf import settings

SCHEMAS = [
    'ADMIN',
    'ACADEMIC',
    'STUDENT',
    'FACULTY',
    'ESTABLISHMENT'
]

def create_schemas():
    with connection.cursor() as cursor:
        # Create schemas with uppercase names
        cursor.execute(f"""
            CREATE SCHEMA IF NOT EXISTS "ADMIN";
            CREATE SCHEMA IF NOT EXISTS "ACADEMIC";
            CREATE SCHEMA IF NOT EXISTS "STUDENT";
            CREATE SCHEMA IF NOT EXISTS "FACULTY";
            CREATE SCHEMA IF NOT EXISTS "ESTABLISHMENT";
        """)
        
        # Set search path with uppercase schema names
        db_name = settings.DATABASES['default']['NAME']
        cursor.execute(f'''
            ALTER DATABASE "{db_name}" 
            SET search_path TO "PUBLIC", "ADMIN", "ACADEMIC", "STUDENT", "FACULTY", "ESTABLISHMENT";
        ''')

def drop_schemas():
    with connection.cursor() as cursor:
        # Drop schemas with uppercase names
        cursor.execute(f"""
            DROP SCHEMA IF EXISTS "ADMIN" CASCADE;
            DROP SCHEMA IF EXISTS "ACADEMIC" CASCADE;
            DROP SCHEMA IF EXISTS "STUDENT" CASCADE;
            DROP SCHEMA IF EXISTS "FACULTY" CASCADE;
            DROP SCHEMA IF EXISTS "ESTABLISHMENT" CASCADE;
        """)
