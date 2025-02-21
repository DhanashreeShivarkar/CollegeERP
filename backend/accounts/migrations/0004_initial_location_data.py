from django.db import migrations

def create_initial_data(apps, schema_editor):
    COUNTRY = apps.get_model('accounts', 'COUNTRY')
    STATE = apps.get_model('accounts', 'STATE')
    CITY = apps.get_model('accounts', 'CITY')
    CURRENCY = apps.get_model('accounts', 'CURRENCY')
    LANGUAGE = apps.get_model('accounts', 'LANGUAGE')
    CATEGORY = apps.get_model('accounts', 'CATEGORY')

    # Create Country
    india = COUNTRY.objects.create(
        NAME='India',
        CODE='IND',
        PHONE_CODE='+91',
        IS_ACTIVE=True
    )

    # Create States
    maharashtra = STATE.objects.create(
        COUNTRY=india,
        NAME='Maharashtra',
        CODE='MH',
        IS_ACTIVE=True
    )

    gujarat = STATE.objects.create(
        COUNTRY=india,
        NAME='Gujarat',
        CODE='GJ',
        IS_ACTIVE=True
    )

    # Create Cities
    CITY.objects.create(
        STATE=maharashtra,
        NAME='Mumbai',
        CODE='MUM',
        IS_ACTIVE=True
    )

    CITY.objects.create(
        STATE=maharashtra,
        NAME='Pune',
        CODE='PUN',
        IS_ACTIVE=True
    )

    CITY.objects.create(
        STATE=gujarat,
        NAME='Ahmedabad',
        CODE='AMD',
        IS_ACTIVE=True
    )

    # Create Currency
    CURRENCY.objects.create(
        NAME='Indian Rupee',
        CODE='INR',
        SYMBOL='₹',
        IS_ACTIVE=True
    )

    # Create Languages
    LANGUAGE.objects.create(
        NAME='English',
        CODE='en',
        IS_ACTIVE=True
    )

    LANGUAGE.objects.create(
        NAME='Hindi',
        CODE='hi',
        IS_ACTIVE=True
    )

    LANGUAGE.objects.create(
        NAME='Marathi',
        CODE='mr',
        IS_ACTIVE=True
    )

    # Create Categories
    CATEGORY.objects.create(
        NAME='General',
        CODE='GEN',
        DESCRIPTION='General Category',
        RESERVATION_PERCENTAGE=0.00,
        IS_ACTIVE=True
    )

    CATEGORY.objects.create(
        NAME='Scheduled Caste',
        CODE='SC',
        DESCRIPTION='Scheduled Caste Category',
        RESERVATION_PERCENTAGE=15.00,
        IS_ACTIVE=True
    )

    CATEGORY.objects.create(
        NAME='Scheduled Tribe',
        CODE='ST',
        DESCRIPTION='Scheduled Tribe Category',
        RESERVATION_PERCENTAGE=7.50,
        IS_ACTIVE=True
    )

    CATEGORY.objects.create(
        NAME='Other Backward Class',
        CODE='OBC',
        DESCRIPTION='Other Backward Class Category',
        RESERVATION_PERCENTAGE=27.00,
        IS_ACTIVE=True
    )

def reverse_initial_data(apps, schema_editor):
    COUNTRY = apps.get_model('accounts', 'COUNTRY')
    CURRENCY = apps.get_model('accounts', 'CURRENCY')
    LANGUAGE = apps.get_model('accounts', 'LANGUAGE')
    CATEGORY = apps.get_model('accounts', 'CATEGORY')

    COUNTRY.objects.all().delete()
    CURRENCY.objects.all().delete()
    LANGUAGE.objects.all().delete()
    CATEGORY.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0003_country_state_language_currency_category_and_more'),
    ]

    operations = [
        migrations.RunPython(create_initial_data, reverse_initial_data),
    ]
