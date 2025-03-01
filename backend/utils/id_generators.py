import random
import string
from datetime import datetime
from accounts.models import CustomUser

def generate_employee_id(designation_name, year=None):
    if year is None:
        year = datetime.now().year
    
    # Get first letter of designation in uppercase
    designation_code = designation_name[0].upper()
    
    # Base format: EMP{YEAR}{DESIGNATION_CODE}
    base_id = f"EMP{year}{designation_code}"
    
    # Debug log
    print(f"Generating ID with base: {base_id}")
    
    try:
        # Get ALL existing IDs with this pattern, including inactive/deleted users
        existing_ids = CustomUser.objects.filter(
            USER_ID__startswith=base_id
        ).values_list('USER_ID', flat=True)
        
        # Debug log
        print(f"Found existing IDs: {existing_ids}")
        
        if not existing_ids:
            new_id = f"{base_id}001"
            print(f"First ID in sequence: {new_id}")
            return new_id
        
        # Extract sequence numbers and find max
        sequences = []
        for id in existing_ids:
            try:
                seq_num = int(id[-3:])  # Get last 3 digits
                sequences.append(seq_num)
            except ValueError:
                continue
        
        if sequences:
            next_sequence = max(sequences) + 1
        else:
            next_sequence = 1
            
        # Debug log
        print(f"Next sequence number: {next_sequence}")
        
        # Format with leading zeros
        new_id = f"{base_id}{next_sequence:03d}"
        print(f"Generated new ID: {new_id}")
        return new_id
        
    except Exception as e:
        print(f"Error generating ID: {str(e)}")
        # Fallback to timestamp-based ID if something goes wrong
        return f"{base_id}{datetime.now().strftime('%H%M%S')}"

def generate_password(length=10):
    # Define character sets
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*"
    
    # Ensure at least one of each type
    password = [
        random.choice(lowercase),
        random.choice(uppercase),
        random.choice(digits),
        random.choice(special)
    ]
    
    # Fill remaining length with random characters
    remaining_length = length - len(password)
    all_chars = lowercase + uppercase + digits + special
    password.extend(random.choice(all_chars) for _ in range(remaining_length))
    
    # Shuffle the password
    random.shuffle(password)
    
    return ''.join(password)
