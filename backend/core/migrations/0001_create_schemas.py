from django.db import migrations

def create_schemas(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        # Create schemas
        cursor.execute('CREATE SCHEMA IF NOT EXISTS "ADMIN"')
        cursor.execute('CREATE SCHEMA IF NOT EXISTS "ACADEMIC"')
        cursor.execute('CREATE SCHEMA IF NOT EXISTS "STUDENT"')
        cursor.execute('CREATE SCHEMA IF NOT EXISTS "FACULTY"')
        
        # Set the search path
        cursor.execute('SET search_path TO "PUBLIC", "ADMIN", "ACADEMIC", "STUDENT", "FACULTY"')

def reverse_schemas(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute('DROP SCHEMA IF EXISTS "ADMIN" CASCADE')
        cursor.execute('DROP SCHEMA IF EXISTS "ACADEMIC" CASCADE')
        cursor.execute('DROP SCHEMA IF EXISTS "STUDENT" CASCADE')
        cursor.execute('DROP SCHEMA IF EXISTS "FACULTY" CASCADE')

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
    ]

    operations = [
        migrations.RunPython(create_schemas, reverse_schemas),
    ]
