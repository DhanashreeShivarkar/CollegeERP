from django.core.mail import send_mail
from django.conf import settings

def send_credentials_email(email, employee_id, username, password):
    subject = 'Your College ERP Account Credentials'
    message = f"""
    Welcome to College ERP!

    Your account has been created with the following credentials:

    Employee ID: {employee_id}
    Username: {username}
    Password: {password}

    Please login at: {settings.FRONTEND_URL}/login
    
    For security reasons, please change your password after first login.

    Note: This is a system generated email. Please do not reply.
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
