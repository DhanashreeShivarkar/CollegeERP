from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
import logging  # Add this import

logger = logging.getLogger(__name__)  # Add this line

from .models import (
    CustomUser, COUNTRY, STATE, CITY, 
    CURRENCY, LANGUAGE, DESIGNATION, CATEGORY,
    UNIVERSITY, INSTITUTE, DEPARTMENT, PROGRAM ,BRANCH # Add these imports
)
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    CountrySerializer, StateSerializer, CitySerializer,
    CurrencySerializer, LanguageSerializer, DesignationSerializer,
    CategorySerializer, UniversitySerializer, InstituteSerializer, DepartmentSerializer, ProgramSerializer ,BranchSerializer# Add these imports
)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.settings import api_settings
from rest_framework.permissions import AllowAny

class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def post(self, request):
        print("==== Login Request ====")
        print(f"Request Data: {request.data}")
        print(f"Request Headers: {request.headers}")
        print(f"Request Method: {request.method}")
        print(f"Request Path: {request.path}")
        
        user_id = request.data.get('user_id')
        password = request.data.get('password')

        if not user_id or not password:
            print(f"Missing credentials - user_id: {bool(user_id)}, password: {bool(password)}")
            return Response({
                'status': 'error',
                'message': 'Please provide both USER_ID and PASSWORD'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            print(f"Looking for user with ID: {user_id.upper()}")
            user = CustomUser.objects.get(USER_ID=user_id.upper())
            
            print(f"Login attempt for user: {user.USER_ID}")
            print(f"Failed attempts: {user.FAILED_LOGIN_ATTEMPTS}")
            print(f"Last failed login: {user.LAST_FAILED_LOGIN}")
            print(f"Permanent lock: {user.PERMANENT_LOCK}")

            if not user.IS_ACTIVE:
                return Response({
                    'status': 'error',
                    'message': 'Account is not active'
                }, status=status.HTTP_403_FORBIDDEN)

            # Check account lock status
            is_locked, lock_message = user.is_account_locked()
            if is_locked:
                return Response({
                    'status': 'error',
                    'message': lock_message
                }, status=status.HTTP_403_FORBIDDEN)

            # Verify password
            if not user.check_password(password):
                user.increment_failed_attempts()
                
                remaining_attempts = 0
                if user.FAILED_LOGIN_ATTEMPTS < 3:
                    remaining_attempts = 3 - user.FAILED_LOGIN_ATTEMPTS
                elif user.FAILED_LOGIN_ATTEMPTS < 5:
                    remaining_attempts = 5 - user.FAILED_LOGIN_ATTEMPTS
                elif user.FAILED_LOGIN_ATTEMPTS < 8:
                    remaining_attempts = 8 - user.FAILED_LOGIN_ATTEMPTS
                
                message = "Invalid credentials. "
                if remaining_attempts > 0:
                    message += f"{remaining_attempts} attempts remaining before next level of account lock."
                else:
                    message += "Account will be locked due to too many failed attempts."
                
                return Response({
                    'status': 'error',
                    'message': message
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Reset failed attempts on successful login
            user.reset_failed_attempts()

            # Generate and send OTP
            otp = user.generate_otp()
            
            try:
                send_mail(
                    subject='Login Verification OTP - College ERP',
                    message=(
                        f'Dear {user.FIRST_NAME},\n\n'
                        f'Your verification OTP is: {otp}\n'
                        f'This OTP will expire in 3 minutes.\n\n'
                        f'If you did not attempt to login, please secure your account.\n\n'
                        f'Best regards,\n'
                        f'College ERP Team'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.EMAIL],
                    fail_silently=False,
                )
                
                return Response({
                    'status': 'success',
                    'message': 'Login successful. Please verify OTP sent to your email.',
                    'user_id': user.USER_ID,
                    'email': user.EMAIL[:3] + '*' * (len(user.EMAIL.split('@')[0]) - 3) + '@' + user.EMAIL.split('@')[1]
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                user.OTP_SECRET = None
                user.save()
                return Response({
                    'status': 'error',
                    'message': 'Failed to send verification OTP. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Invalid USER_ID'
            }, status=status.HTTP_404_NOT_FOUND)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class SendOTPView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
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
 
            # Check account lock status and get detailed message
            is_locked, lock_message = user.is_account_locked()
            if is_locked:
                return Response({
                    'status': 'error',
                    'message': lock_message,
                    'locked': True,
                    'lockTime': user.LOCK_EXPIRY.isoformat() if user.LOCK_EXPIRY else None
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
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def post(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')
        
        if not user_id or not otp:
            return Response({
                'status': 'error',
                'message': 'Both user_id and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(USER_ID=user_id)
            is_valid, message = user.verify_otp(otp)
            
            if is_valid:
                # Update login info
                user.update_login_info(request.META.get('REMOTE_ADDR'))
                
                # Store session data
                session_data = {
                    'user_id': user.USER_ID,
                    'username': user.USERNAME,
                    'email': user.EMAIL,
                    'is_superuser': user.IS_SUPERUSER,
                    'designation': {
                        'code': user.DESIGNATION.CODE,
                        'name': user.DESIGNATION.NAME,
                    },
                    'permissions': user.DESIGNATION.PERMISSIONS,
                    'last_activity': timezone.now().isoformat(),
                    'department_id': getattr(user, 'DEPARTMENT_ID', None),
                    'institute_id': getattr(user, 'INSTITUTE_ID', None)
                }
                
                # Store all session data
                for key, value in session_data.items():
                    request.session[key] = value
                
                # Generate tokens
                refresh = RefreshToken()
                refresh[api_settings.USER_ID_CLAIM] = user.USER_ID
                refresh['user_id'] = user.USER_ID
                refresh['username'] = user.USERNAME
                refresh['is_superuser'] = user.IS_SUPERUSER
                
                return Response({
                    'status': 'success',
                    'message': message,
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': session_data
                }, status=status.HTTP_200_OK)
            
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
            logger.error(f"Error in VerifyOTPView: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An error occurred during authentication'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RequestPasswordResetView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({
                'status': 'error',
                'message': 'Please provide USER_ID'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(USER_ID=user_id.upper())
            
            if not user.IS_ACTIVE:
                return Response({
                    'status': 'error',
                    'message': 'Account is not active'
                }, status=status.HTTP_403_FORBIDDEN)

            # Generate and send OTP
            otp = user.generate_otp()
            
            try:
                send_mail(
                    subject='Password Reset OTP - College ERP',
                    message=(
                        f'Dear {user.FIRST_NAME},\n\n'
                        f'Your password reset OTP is: {otp}\n'
                        f'This OTP will expire in 3 minutes.\n\n'
                        f'If you did not request a password reset, please ignore this email.\n\n'
                        f'Best regards,\n'
                        f'College ERP Team'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.EMAIL],
                    fail_silently=False,
                )
                
                return Response({
                    'status': 'success',
                    'message': 'Password reset OTP sent successfully',
                    'email': user.EMAIL[:3] + '*' * (len(user.EMAIL.split('@')[0]) - 3) + '@' + user.EMAIL.split('@')[1]
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                user.OTP_SECRET = None
                user.save()
                return Response({
                    'status': 'error',

                    'message': 'Failed to send OTP email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class VerifyResetOTPView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')
        
        if not user_id or not otp:
            return Response({
                'status': 'error',
                'message': 'Please provide both USER_ID and OTP'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(USER_ID=user_id.upper())
            is_valid, message = user.verify_otp(otp)
            
            return Response({
                'status': 'success' if is_valid else 'error',
                'message': message,
                'verified': is_valid
            }, status=status.HTTP_200_OK if is_valid else status.HTTP_400_BAD_REQUEST)
            
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([user_id, otp, new_password]):
            return Response({
                'status': 'error',
                'message': 'Please provide USER_ID, OTP and new password'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(USER_ID=user_id.upper())
            is_valid, message = user.verify_otp(otp)
            
            if not is_valid:
                return Response({
                    'status': 'error',
                    'message': message
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(new_password)
            user.OTP_SECRET = None  # Clear OTP after successful password reset
            user.save()
            
            return Response({
                'status': 'success',
                'message': 'Password reset successful'
            }, status=status.HTTP_200_OK)
            
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class MasterTableListView(APIView):
    def get(self, request):
        master_tables = [
            {"name": "country", "display_name": "Country", "endpoint": "http://localhost:8000/api/master/countries/"},
            {"name": "state", "display_name": "State", "endpoint": "http://localhost:8000/api/master/states/"},
            {"name": "city", "display_name": "City", "endpoint": "http://localhost:8000/api/master/cities/"},
            {"name": "currency", "display_name": "Currency", "endpoint": "http://localhost:8000/api/master/currencies/"},
            {"name": "language", "display_name": "Language", "endpoint": "http://localhost:8000/api/master/languages/"},
            {"name": "designation", "display_name": "Designation", "endpoint": "http://localhost:8000/api/master/designations/"},
            {"name": "department", "display_name": "Department", "endpoint": "http://localhost:8000/api/master/departments/"},
            {"name": "category", "display_name": "Category", "endpoint": "http://localhost:8000/api/master/categories/"}
        ]
        return Response(master_tables)

class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_username_from_request(self):
        """Get username from multiple possible sources"""
        try:
            # Try Authorization header first
            auth_header = self.request.headers.get('Authorization', '')
            if (auth_header and auth_header.startswith('Username ')):
                username = auth_header.split(' ')[1]
                logger.debug(f"Username from Auth header: {username}")
                return username

            # Try X-Username header next
            username = self.request.headers.get('X-Username')
            if username:
                logger.debug(f"Username from X-Username header: {username}")
                return username

            # Try getting from user object
            if hasattr(self.request.user, 'USERNAME') and self.request.user.USERNAME:
                logger.debug(f"Username from user object: {self.request.user.USERNAME}")
                return self.request.user.USERNAME

            # Fallback
            logger.warning("No username found, using SYSTEM")
            return 'SYSTEM'
        except Exception as e:
            logger.error(f"Error getting username: {str(e)}")
            return 'SYSTEM'

    def perform_create(self, serializer):
        username = self.get_username_from_request()
        logger.debug(f"Create by user: {username}")
        serializer.save(
            CREATED_BY=username,
            UPDATED_BY=username
        )

    def perform_update(self, serializer):
        username = self.get_username_from_request()
        logger.debug(f"Update by user: {username}")
        serializer.save(UPDATED_BY=username)

    def perform_destroy(self, instance):
        username = self.get_username_from_request()
        logger.debug(f"Performing soft delete by user: {username}")
        
        instance.IS_DELETED = True
        instance.DELETED_AT = timezone.now()
        instance.DELETED_BY = username
        instance.save()
        
        logger.info(f"Record {instance.pk} soft deleted by {username}")

class CountryViewSet(BaseModelViewSet):
    queryset = COUNTRY.objects.all()
    serializer_class = CountrySerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        countries = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(countries, many=True)
        return Response(serializer.data)

class StateViewSet(BaseModelViewSet):
    queryset = STATE.objects.all()
    serializer_class = StateSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        states = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(states, many=True)
        return Response(serializer.data)

class CityViewSet(BaseModelViewSet):
    queryset = CITY.objects.all()
    serializer_class = CitySerializer

    def get_queryset(self):
        # Only return non-deleted records
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        # Only list active and non-deleted records
        cities = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(cities, many=True)
        return Response(serializer.data)

class CurrencyViewSet(BaseModelViewSet):
    queryset = CURRENCY.objects.all()
    serializer_class = CurrencySerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        currencies = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(currencies, many=True)
        return Response(serializer.data)

class LanguageViewSet(BaseModelViewSet):
    queryset = LANGUAGE.objects.all()
    serializer_class = LanguageSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        languages = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(languages, many=True)
        return Response(serializer.data)

class DesignationViewSet(BaseModelViewSet):
    queryset = DESIGNATION.objects.all()
    serializer_class = DesignationSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        designations = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(designations, many=True)
        return Response(serializer.data)

class CategoryViewSet(BaseModelViewSet):
    queryset = CATEGORY.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def create(self, request, *args, **kwargs):
        try:
            # Validate required fields
            required_fields = {
                'NAME': 'Category name',
                'CODE': 'Category code',
                'RESERVATION_PERCENTAGE': 'Reservation percentage'
            }
            
            missing_fields = [
                field_name for field, field_name in required_fields.items() 
                if field not in request.data
            ]
            
            if missing_fields:
                return Response({
                    'error': 'Missing required fields',
                    'message': f"Please provide: {', '.join(missing_fields)}",
                    'fields': missing_fields
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create category with proper error handling
            serializer = self.get_serializer(data=request.data)
            
            try:
                serializer.is_valid(raise_exception=True)
            except serializers.ValidationError as e:
                # Get the first validation error
                error_detail = e.detail
                if isinstance(error_detail, dict) and 'error' in error_detail:
                    # If it's our custom formatted error, return as is
                    return Response(error_detail, status=status.HTTP_400_BAD_REQUEST)
                else:
                    # Format other validation errors
                    field = list(error_detail.keys())[0]
                    return Response({
                        'error': 'Validation error',
                        'message': str(error_detail[field][0]),
                        'field': field
                    }, status=status.HTTP_400_BAD_REQUEST)

            self.perform_create(serializer)
            
            return Response({
                'status': 'success',
                'message': 'Category created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Server error',
                'message': 'An unexpected error occurred while creating the category',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        categories = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

class UniversityViewSet(BaseModelViewSet):
    queryset = UNIVERSITY.objects.all()
    serializer_class = UniversitySerializer

    def list(self, request, *args, **kwargs):
        universities = self.queryset.filter(IS_ACTIVE=True)
        serializer = self.get_serializer(universities, many=True)
        return Response(serializer.data)

class InstituteViewSet(BaseModelViewSet):
    queryset = INSTITUTE.objects.all()
    serializer_class = InstituteSerializer

    def list(self, request, *args, **kwargs):
        university_id = request.GET.get("university_id")  # Get university_id from query params
        institutes = self.queryset.filter(IS_ACTIVE=True)

        if university_id:
            institutes = institutes.filter(UNIVERSITY=university_id)  # Apply filtering

        serializer = self.get_serializer(institutes, many=True)
        return Response(serializer.data)
   
class DepartmentViewSet(BaseModelViewSet):
    queryset = DEPARTMENT.objects.all()
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def list(self, request, *args, **kwargs):
        departments = self.queryset.filter(IS_ACTIVE=True, IS_DELETED=False)
        serializer = self.get_serializer(departments, many=True)
        return Response(serializer.data)
    
class ProgramListCreateView(BaseModelViewSet):
    queryset = PROGRAM.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Program created successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        
        print("Serializer Errors:", serializer.errors)  # 🔥 Print errors to console
        return Response(
            {"error": serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
from django.http import JsonResponse
from django.views import View

from django.http import JsonResponse
from django.views import View

class ProgramTableListView(View):
    def get(self, request):
        program_master = [  # ✅ Fixed variable name (no hyphen)
            {"name": "program", "display_name": "Program", "api_url": "http://localhost:8000/api/master/program/"},
            {"name": "BRANCH_MASTER", "display_name": "Branch"},
            {"name": "YEAR_MASTER", "display_name": "Year"},
            {"name": "SEMESTER_MASTER", "display_name": "Semester"},
            {"name": "COURSE_MASTER", "display_name": "Course"},
        ]
        return JsonResponse(program_master, safe=False)  # ✅ Fixed variable reference



class BranchListCreateView(BaseModelViewSet):
    queryset = BRANCH.objects.all()
    serializer_class = BranchSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Clear user session
            request.session.flush()
            
            # Blacklist the JWT token if you're using JWT
            try:
                refresh_token = request.data.get('refresh_token')
                if refresh_token:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
            except Exception as e:
                logger.warning(f"Error blacklisting token: {str(e)}")
            
            return Response({
                'status': 'success',
                'message': 'Successfully logged out'
            })
        except Exception as e:
            logger.error(f"Error in logout: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Error during logout'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



