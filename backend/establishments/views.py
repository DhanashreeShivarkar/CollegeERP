from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.core.mail import send_mail
from django.conf import settings
from utils.id_generators import generate_employee_id, generate_password
from accounts.models import CustomUser, DESIGNATION
from .models import TYPE_MASTER, STATUS_MASTER, SHIFT_MASTER, EMPLOYEE_MASTER
from .serializers import TypeMasterSerializer, StatusMasterSerializer, ShiftMasterSerializer, EmployeeMasterSerializer
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

class EmployeeMasterTableView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        master_tables = [
            {
                "name": "type", 
                "display_name": "Employee Type Master", 
                "endpoint": "/api/establishment/type/"  # Updated endpoint
            },
            {
                "name": "status", 
                "display_name": "Employee Status Master", 
                "endpoint": "/api/establishment/status/"  # Updated endpoint
            },
            {
                "name": "shift", 
                "display_name": "Employee Shift Master", 
                "endpoint": "/api/establishment/shift/"  # Updated endpoint
            }
        ]
        logger.debug(f"Returning employee master tables: {master_tables}")
        return Response(master_tables)

class BaseMasterViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Temporarily allow all access

    def get_username_from_request(self):
        auth_header = self.request.headers.get('Authorization', '')
        if (auth_header.startswith('Username ')):
            return auth_header.split(' ')[1]
        return 'SYSTEM'

    def perform_create(self, serializer):
        try:
            username = self.get_username_from_request()
            logger.debug(f"Using username: {username}")
            serializer.save(CREATED_BY=username)
        except Exception as e:
            logger.error(f"Error in perform_create: {str(e)}")
            raise

    def perform_update(self, serializer):
        try:
            username = self.get_username_from_request()
            serializer.save(UPDATED_BY=username)
        except Exception as e:
            logger.error(f"Error in perform_update: {str(e)}")
            raise

    def perform_destroy(self, instance):
        try:
            username = self.get_username_from_request()
            instance.IS_DELETED = True
            instance.DELETED_AT = timezone.now()
            instance.DELETED_BY = username
            instance.save()
        except Exception as e:
            logger.error(f"Error in perform_destroy: {str(e)}")
            raise

class TypeMasterViewSet(BaseMasterViewSet):
    queryset = TYPE_MASTER.objects.all()
    serializer_class = TypeMasterSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

    def update(self, request, *args, **kwargs):
        logger.debug(f"Update request data: {request.data}")
        instance = self.get_object()
        logger.debug(f"Updating instance: {instance.ID}")
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        logger.debug(f"Updated data: {serializer.data}")
        return Response(serializer.data)

class StatusMasterViewSet(BaseMasterViewSet):
    queryset = STATUS_MASTER.objects.all()
    serializer_class = StatusMasterSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

class ShiftMasterViewSet(BaseMasterViewSet):
    queryset = SHIFT_MASTER.objects.all()
    serializer_class = ShiftMasterSerializer

    def get_queryset(self):
        return self.queryset.filter(IS_DELETED=False)

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = EmployeeMasterSerializer
    queryset = EMPLOYEE_MASTER.objects.filter(IS_DELETED=False)

    def create(self, request, *args, **kwargs):
        try:
            logger.info("=== Starting Employee Creation Process ===")
            
            # 1. Generate employee ID and password
            designation_id = request.data.get('DESIGNATION')
            designation_obj = DESIGNATION.objects.get(DESIGNATION_ID=designation_id)
            employee_id = generate_employee_id(designation_obj.NAME)
            password = generate_password(8)
            
            logger.info(f"Generated employee ID: {employee_id}")

            # 2. Create employee data
            employee_data = request.data.copy()
            employee_data._mutable = True
            employee_data['EMPLOYEE_ID'] = employee_id
            employee_data['IS_ACTIVE'] = 'YES'
            employee_data._mutable = False

            # 3. Validate and save employee
            serializer = self.get_serializer(data=employee_data)
            if not serializer.is_valid():
                logger.error("Validation errors:")
                logger.error(serializer.errors)
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            employee = serializer.save()

            # 4. Create user with proper password hashing
            try:
                username = request.data.get('EMAIL').split('@')[0]
                user = CustomUser.objects.create(
                    USER_ID=employee_id,
                    USERNAME=username,
                    EMAIL=request.data.get('EMAIL'),
                    IS_ACTIVE=True,
                    IS_STAFF=False,
                    IS_SUPERUSER=False,
                    DESIGNATION=designation_obj,
                    FIRST_NAME=request.data.get('EMP_NAME')
                )
                # Properly set hashed password
                user.set_password(password)  # This will properly hash the password
                user.save()
                
                logger.info(f"User created with ID: {user.USER_ID}")
            except Exception as user_error:
                employee.delete()
                logger.error(f"User creation failed: {str(user_error)}")
                raise

            # 5. Send welcome email
            email_subject = "Your College ERP Account Credentials"
            email_message = f"""
            Dear {request.data.get('EMP_NAME')},

            Your College ERP account has been created. Here are your login credentials:

            Employee ID: {employee_id}
            Username: {user.USERNAME}
            Password: {password}

            Please change your password after first login.

            Best regards,
            College ERP Team
            """

            send_mail(
                email_subject,
                email_message,
                settings.EMAIL_HOST_USER,
                [user.EMAIL],
                fail_silently=False,
            )

            return Response({
                'message': 'Employee and user account created successfully',
                'employee_id': employee_id,
                'username': username
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error in create process: {str(e)}", exc_info=True)
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
