from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
import getpass
from accounts.models import DESIGNATION, CustomUser

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Get USER_ID
        while True:
            user_id = input('USER_ID: ')
            if user_id:
                if not CustomUser.objects.filter(USER_ID=user_id).exists():
                    break
                self.stderr.write("Error: This USER_ID already exists.")
            else:
                self.stderr.write("Error: USER_ID cannot be empty.")

        # Get USERNAME
        while True:
            username = input('USERNAME: ')
            if username:
                if not CustomUser.objects.filter(USERNAME=username).exists():
                    break
                self.stderr.write("Error: This USERNAME already exists.")
            else:
                self.stderr.write("Error: USERNAME cannot be empty.")

        # Get EMAIL
        while True:
            email = input('EMAIL: ')
            if email:
                if not CustomUser.objects.filter(EMAIL=email).exists():
                    break
                self.stderr.write("Error: This EMAIL already exists.")
            else:
                self.stderr.write("Error: EMAIL cannot be empty.")

        # Get FIRST_NAME
        first_name = input('FIRST_NAME: ')
        
        # Get LAST_NAME
        last_name = input('LAST_NAME: ')

        # Show available designations in a table format
        designations = DESIGNATION.objects.filter(IS_ACTIVE=True).order_by('DESIGNATION_ID')
        if not designations.exists():
            self.stderr.write("No designations found. Please run: python manage.py loaddata initial_designations")
            return

        self.stdout.write("\nAvailable Designations:")
        self.stdout.write("-" * 70)
        self.stdout.write(f"{'ID':<5} {'NAME':<20} {'CODE':<20}")
        self.stdout.write("-" * 70)
        
        for d in designations:
            self.stdout.write(f"{d.DESIGNATION_ID:<5} {d.NAME:<20} {d.CODE:<20}")
        
        self.stdout.write("-" * 70)

        while True:
            try:
                choice = input("\nSelect designation ID: ")
                designation = designations.get(DESIGNATION_ID=int(choice))
                break
            except (ValueError, DESIGNATION.DoesNotExist):
                self.stderr.write("Invalid designation ID. Please try again.")

        # Get PASSWORD
        while True:
            password = getpass.getpass('PASSWORD: ')
            password2 = getpass.getpass('PASSWORD (again): ')
            if password == password2:
                if len(password) >= 8:
                    break
            self.stderr.write("Error: Passwords didn't match or too short (minimum 8 characters).")

        # Create superuser
        user = CustomUser.objects.create(
            USER_ID=user_id,
            USERNAME=username,
            EMAIL=email,
            FIRST_NAME=first_name,
            LAST_NAME=last_name,
            DESIGNATION=designation,
            IS_STAFF=True,
            IS_SUPERUSER=True,
            IS_ACTIVE=True
        )
        user.set_password(password)
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'\nSuperuser "{username}" created successfully with designation "{designation.NAME}".'
        ))