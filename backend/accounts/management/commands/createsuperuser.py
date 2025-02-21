from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError
from django.utils.text import capfirst
from accounts.models import DESIGNATION, CustomUser

class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        username_field = self.UserModel._meta.get_field(self.UserModel.USERNAME_FIELD)
        
        # Get all required fields
        required_fields = {
            'USER_ID': None,
            'USERNAME': None,
            'EMAIL': None,
            'PASSWORD': None,
            'DESIGNATION_ID': None
        }

        for field_name in required_fields:
            field_value = options.get(field_name)
            
            while field_value is None:
                if field_name == 'PASSWORD':
                    field_value = self.get_password()
                else:
                    message = f"{field_name}: "
                    raw_value = input(message)
                    
                    if field_name == 'DESIGNATION_ID':
                        try:
                            field_value = int(raw_value)
                        except ValueError:
                            self.stderr.write("Error: DESIGNATION_ID must be a number")
                            continue
                    else:
                        field_value = raw_value

            required_fields[field_name] = field_value

        try:
            # Remove user_data dictionary and directly call create_superuser with uppercase fields
            user = self.UserModel._default_manager.create_superuser(
                USER_ID=required_fields['USER_ID'],
                USERNAME=required_fields['USERNAME'],
                EMAIL=required_fields['EMAIL'],
                password=required_fields['PASSWORD'],
                DESIGNATION=DESIGNATION.objects.get(DESIGNATION_ID=required_fields['DESIGNATION_ID'])
            )

            if options.get('verbosity', 0) >= 1:
                self.stdout.write("Superuser created successfully.")
        except Exception as e:
            raise CommandError(str(e))

    def get_password(self):
        while True:
            password = input('Password: ')
            password2 = input('Password (again): ')
            if password == password2:
                return password
            self.stderr.write("Error: Your passwords didn't match.")