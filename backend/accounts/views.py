from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone  # Add this import
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from django.db import transaction
import traceback
import json

class LoginView(APIView):
    def post(self, request):
        try:
            print("\n=== Login Debug ===")
            user_id = request.data.get('user_id', '').strip().upper()
            password = request.data.get('password', '').strip()
            
            try:
                user = CustomUser.objects.get(USER_ID=user_id)
                
                # Check if account is locked
                is_locked, lock_message = user.is_account_locked()
                if is_locked:
                    return Response({
                        'status': 'error',
                        'message': lock_message,
                        'locked': True,
                        'reason': user.LOCK_REASON,
                        'attempts': user.FAILED_LOGIN_ATTEMPTS,
                        'last_attempt': user.LAST_LOGIN_ATTEMPT
                    }, status=status.HTTP_403_FORBIDDEN)

                # Check password
                if not user.check_password(password):
                    user.increment_failed_attempts()
                    attempts_left = 3
                    if user.FAILED_LOGIN_ATTEMPTS < 3:
                        attempts_left = 3 - user.FAILED_LOGIN_ATTEMPTS
                    elif user.FAILED_LOGIN_ATTEMPTS < 5:
                        attempts_left = 5 - user.FAILED_LOGIN_ATTEMPTS
                    elif user.FAILED_LOGIN_ATTEMPTS < 8:
                        attempts_left = 8 - user.FAILED_LOGIN_ATTEMPTS
                    
                    return Response({
                        'status': 'error',
                        'message': f'Invalid credentials. {attempts_left} attempts remaining before next lockout.',
                        'attempts': user.FAILED_LOGIN_ATTEMPTS,
                        'last_attempt': user.LAST_LOGIN_ATTEMPT
                    }, status=status.HTTP_401_UNAUTHORIZED)

                # Success - generate and send OTP
                otp = user.generate_otp()
                if not otp:
                    raise Exception("Failed to generate OTP")

                print(f"Generated OTP: {otp}")

                # Send email
                send_mail(
                    'Login Verification',
                    f'Your verification code is: {otp}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.EMAIL],
                    fail_silently=False
                )

                return Response({
                    'status': 'success',
                    'message': 'OTP sent successfully',
                    'user_id': user.USER_ID,
                    'email': user.EMAIL
                })

            except CustomUser.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            print(f"Login error: {str(e)}")
            print(traceback.format_exc())
            return Response({
                'status': 'error',
                'message': 'An error occurred during login'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendOTPView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({
                'status': 'error',
                'message': 'Please provide USER_ID'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(USER_ID=user_id)
            
            if not user.IS_ACTIVE:
                return Response({
                    'status': 'error',
                    'message': 'Account is not active'
                }, status=status.HTTP_403_FORBIDDEN)

            if user.is_account_locked():
                return Response({
                    'status': 'error',
                    'message': 'Account is locked. Please try again later.'
                }, status=status.HTTP_403_FORBIDDEN)

            otp = user.generate_otp()
            
            try:
                send_mail(
                    subject='Login OTP - College ERP',
                    message=(
                        f'Dear {user.FIRST_NAME},\n\n'
                        f'Your OTP for login is: {otp}\n'
                        f'This OTP will expire in 3 minutes.\n\n'
                        f'If you did not request this OTP, please ignore this email.\n\n'
                        f'Best regards,\n'
                        f'College ERP Team'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.EMAIL],
                    fail_silently=False,
                )
                
                return Response({
                    'status': 'success',
                    'message': f'OTP sent successfully to {user.EMAIL}',
                    'user_id': user.USER_ID,
                    'email': user.EMAIL[:3] + '*' * (len(user.EMAIL.split('@')[0]) - 3) + '@' + user.EMAIL.split('@')[1]
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                user.OTP_SECRET = None
                user.save()
                return Response({
                    'status': 'error',
                    'message': 'Failed to send OTP email. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Invalid USER_ID'
            }, status=status.HTTP_404_NOT_FOUND)

class VerifyOTPView(APIView):
    def post(self, request):
        print("\n=== OTP Verification Request ===")
        print(f"Request Data: {request.data}")
        
        try:
            user_id = request.data.get('user_id', '').strip()
            otp = request.data.get('otp', '').strip()

            if not user_id or not otp:
                return Response({
                    'status': 'error',
                    'message': 'Both user_id and OTP are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                user = CustomUser.objects.select_for_update().get(USER_ID=user_id.upper())
                # Use clear_on_success=True for login OTP
                is_valid, message = user.verify_otp(otp, clear_on_success=True)
                
                if is_valid:
                    # Update login info
                    user.update_login_info(request.META.get('REMOTE_ADDR'))
                    
                    # Include complete designation details
                    designation = user.DESIGNATION
                    return Response({
                        'status': 'success',
                        'message': message,
                        'user': {
                            'user_id': user.USER_ID,
                            'username': user.USERNAME,
                            'email': user.EMAIL,
                            'designation': {
                                'id': designation.DESIGNATION_ID,
                                'name': designation.NAME,
                                'code': designation.CODE,
                                'permissions': designation.PERMISSIONS
                            } if designation else None
                        }
                    })
                
                return Response({
                    'status': 'error',
                    'message': message
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Invalid user'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"OTP verification error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Verification failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RequestPasswordResetView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('user_id', '').strip().upper()
            
            try:
                user = CustomUser.objects.get(USER_ID=user_id)
                otp = user.generate_otp()
                
                if otp:
                    send_mail(
                        'Password Reset OTP',
                        f'Your OTP for password reset is: {otp}',
                        settings.DEFAULT_FROM_EMAIL,
                        [user.EMAIL],
                        fail_silently=False,
                    )
                    return Response({
                        'status': 'success',
                        'message': 'OTP sent to your registered email',
                        'email': user.EMAIL
                    })
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Failed to generate OTP'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except CustomUser.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            print(f"Password reset error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to process request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyResetOTPView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('user_id', '').strip().upper()
            otp = request.data.get('otp', '').strip()
            
            try:
                user = CustomUser.objects.get(USER_ID=user_id)
                # Don't clear OTP after verification
                is_valid, message = user.verify_otp(otp, clear_on_success=False)
                
                return Response({
                    'status': 'success' if is_valid else 'error',
                    'message': message,
                    'verified': is_valid
                })
                
            except CustomUser.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            print(f"OTP verification error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to verify OTP'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('user_id', '').strip().upper()
            otp = request.data.get('otp', '').strip()
            new_password = request.data.get('new_password', '').strip()
            
            try:
                with transaction.atomic():
                    user = CustomUser.objects.select_for_update().get(USER_ID=user_id)
                    
                    # First check if password is in history
                    try:
                        if not user.check_password_history(new_password):
                            return Response({
                                'status': 'error',
                                'message': 'Cannot reuse any of your last 5 passwords'
                            }, status=status.HTTP_400_BAD_REQUEST)
                    except Exception as e:
                        print(f"Password history check error: {str(e)}")
                        return Response({
                            'status': 'error',
                            'message': str(e)
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Then verify OTP
                    is_valid, message = user.verify_otp(otp, clear_on_success=True)
                    if not is_valid:
                        return Response({
                            'status': 'error',
                            'message': message
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # If both checks pass, reset password
                    user.set_password(new_password)
                    user.PASSWORD_CHANGED_AT = timezone.now()
                    user.FAILED_LOGIN_ATTEMPTS = 0
                    user.IS_LOCKED = False
                    user.LOCKED_UNTIL = None
                    user.OTP_VERIFIED = False
                    user.save()
                    
                    return Response({
                        'status': 'success',
                        'message': 'Password reset successful'
                    })
                    
            except CustomUser.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            print(f"Password reset error: {str(e)}")
            print(traceback.format_exc())  # Add this for better error tracking
            return Response({
                'status': 'error',
                'message': 'Failed to reset password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
