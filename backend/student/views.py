from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.core.mail import send_mail
from .models import STUDENT_MASTER, BRANCH, STUDENT_DETAILS, STUDENT_ACADEMIC_RECORD
from .serializers import StudentMasterSerializer
from .models import STUDENT_MASTER, BRANCH, STUDENT_DETAILS, CHECK_LIST_DOCUMENTS, STUDENT_DOCUMENTS
from .serializers import StudentMasterSerializer, CheckListDoumentsSerializer, StudentDocumentsSerializer
from django.conf import settings
import logging
from django.http import Http404
from django.utils import timezone
from django.db.models import Q
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from utils.id_generators import generate_student_id
from django.contrib.auth import get_user_model
from utils.id_generators import generate_password
from accounts.models import DESIGNATION
from accounts.models import CustomUser, YEAR
from accounts.views import BaseModelViewSet

logger = logging.getLogger(__name__)

class StudentMasterViewSet(viewsets.ModelViewSet):
    queryset = STUDENT_MASTER.objects.filter(IS_DELETED=False)
    serializer_class = StudentMasterSerializer
    lookup_field = 'STUDENT_ID'  # Very important
    
    def get_or_default(value, default=None, data_type=int):
        """Returns integer value if valid, otherwise returns default"""
        try:
            if value in [None, '']:
                return default
            return data_type(value)
        except (ValueError, TypeError):
            return default

    def create(self, request, *args, **kwargs):
        try:
            print("=== Student Creation Debug ===")
            print("Request data:", request.data)
            
            # Convert request data to mutable dictionary
            data = request.data.copy()
            
            # Check for required fields
            required_fields = [
                'INSTITUTE', 'ACADEMIC_YEAR', 'BATCH', 'ADMISSION_CATEGORY',
                'ADMN_QUOTA_ID', 'YEAR_ID',  # Added this field
                'FORM_NO', 'NAME', 'SURNAME', 'FATHER_NAME', 'GENDER',
                'DOB', 'MOB_NO', 'EMAIL_ID', 'PER_ADDRESS', 'BRANCH_ID'
            ]
            
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({
                    'status': 'error',
                    'message': f'Missing required fields: {", ".join(missing_fields)}'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate branch
            branch_id = request.data.get('BRANCH_ID')
            try:
                branch = BRANCH.objects.select_related('PROGRAM').get(BRANCH_ID=branch_id)
            except BRANCH.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Invalid Branch ID'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Add quota validation if needed
            admission_quota = request.data.get('ADMN_QUOTA_ID')
            if not admission_quota:
                return Response({
                    'status': 'error',
                    'message': 'ADMN_QUOTA_ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            # Validate that YEAR_ID is provided and exists
            year_id = data.get('YEAR_ID')
            try:
                year_instance = YEAR.objects.get(pk=year_id)
                data['YEAR_SEM_ID'] = year_id  # Store selected year_id
            except YEAR.DoesNotExist:
                return Response({'status': 'error', 'message': 'Invalid YEAR_ID'}, status=status.HTTP_400_BAD_REQUEST)

             

            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                student = serializer.save()
                
                # Save student_id in STUDENT_DETAILS table
                STUDENT_DETAILS.objects.create(STUDENT_ID=STUDENT_MASTER.objects.get(STUDENT_ID=student.STUDENT_ID))
                
                # Also save entry in STUDENT_ACADEMIC_RECORD table
                STUDENT_ACADEMIC_RECORD.objects.create(
                    STUDENT_ID=student.STUDENT_ID,
                    INSTITUTE_ID=student.INSTITUTE,
                    CATEGORY=int(student.ADMISSION_CATEGORY),
                    BATCH=student.BATCH,
                    ACADEMIC_YEAR=student.ACADEMIC_YEAR,
                    CLASS_YEAR=student.YEAR_SEM_ID,
                    ADMISSION_DATE=student.ADMISSION_DATE,
                    FORM_NO=student.FORM_NO,
                    QUOTA_ID=student.ADMN_QUOTA_ID,
                    STATUS=student.STATUS, 
                    FEE_CATEGORY_ID=int(student.ADMISSION_CATEGORY),
                )
                
                # Create user account with password same as student_id
            try:
                username = request.data.get('EMAIL_ID').split('@')[0]
                password = student.STUDENT_ID  # Use student_id as password
                
                user = CustomUser.objects.create(
                    USER_ID=student.STUDENT_ID,
                    USERNAME=username,
                    EMAIL=request.data.get('EMAIL_ID'),
                    IS_ACTIVE=True,
                    IS_STAFF=False,
                    IS_SUPERUSER=False,
                    DESIGNATION=None,  # Students typically don't have a designation
                    FIRST_NAME=request.data.get('NAME')
                )
                user.set_password(password)
                user.save()
                
                print(f"User created with ID: {user.USER_ID}")
                

                # Send welcome email (optional)
                email_subject = "Your Student Account Credentials"
                email_message = f"""
                Dear {request.data.get('NAME')},

                Your student account has been created. Here are your login credentials:

                Student ID: {student.STUDENT_ID}
                Username: {username}
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

            except Exception as user_error:
                # Rollback student creation if user creation fails
                student.delete()
                print(f"User creation failed: {str(user_error)}")
                raise

            return Response({
                'status': 'success',
                'message': 'Student created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
            
        except Exception as e:
            logger.error(f"Error creating student: {str(e)}", exc_info=True)
            return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        try:
            students = self.get_queryset()
            serializer = self.get_serializer(students, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error listing students: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    def update(self, request, *args, **kwargs):
        try:
            student_id = kwargs.get(self.lookup_field)
            if not student_id:
                return Response({
                'status': 'error',
                'message': 'Student ID is required for update.'
            }, status=status.HTTP_400_BAD_REQUEST)
                    
            try:
                student_instance = self.get_queryset().get(STUDENT_ID=student_id)
            except STUDENT_MASTER.DoesNotExist:
                return Response({
                'status': 'error',
                'message': 'Student not found.'
            }, status=status.HTTP_404_NOT_FOUND)

            # Convert request data to mutable dictionary
            data = request.data.copy()

            # Optional: Validate fields if needed before updating
            # E.g., validate if BRANCH_ID is valid if provided
            branch_id = data.get('BRANCH_ID')
            if branch_id:
                try:
                    branch = BRANCH.objects.get(BRANCH_ID=branch_id)
                except BRANCH.DoesNotExist:
                  return Response({
                    'status': 'error',
                    'message': 'Invalid Branch ID'
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(student_instance, data=data, partial=True)
            if serializer.is_valid():
                updated_student = serializer.save()

                return Response({
                        'status': 'success',
                        'message': 'Student updated successfully.',
                        'data': serializer.data
                    }, status=status.HTTP_200_OK)
            else:
              return Response({
                'status': 'error',
                'message': 'Validation failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
         logger.error(f"Error updating student: {str(e)}", exc_info=True)
         return Response({
            'status': 'error',
            'message': str(e)
         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=False, methods=['get'])
    def search(self, request):
        try:
            query = request.query_params.get('query', '')
            if not query:
                return Response({
                    'status': 'error',
                    'message': 'Search query is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            students = self.queryset.filter(
                Q(STUDENT_ID__icontains=query) |
                Q(NAME__icontains=query) |
                Q(SURNAME__icontains=query) |
                Q(MOB_NO__icontains=query) |
                Q(EMAIL_ID__icontains=query)
            )[:10]

            serializer = self.get_serializer(students, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            })

        except Exception as e:
            logger.error(f"Error searching students: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    @action(detail=False, methods=['get'], url_path='student-ids')
    def student_ids(self, request):
        try:
            student_ids = STUDENT_MASTER.objects.filter(IS_ACTIVE='YES').values_list('STUDENT_ID', flat=True)
            return Response({
                'status': 'success',
                'data': list(student_ids)
            })
        except Exception as e:
            logger.error(f"Error fetching student IDs: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=500)        
    
class CheckListDocumnetsCreateView(BaseModelViewSet):
     queryset = CHECK_LIST_DOCUMENTS.objects.all()   
     serializer_class = CheckListDoumentsSerializer
      
     def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import STUDENT_DOCUMENTS
from .serializers import StudentDocumentsSerializer

class StudentDocumentsViewSet(ModelViewSet):  # or BaseModelViewSet if customized
    queryset = STUDENT_DOCUMENTS.objects.all()
    serializer_class = StudentDocumentsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        student_id = data.get('STUDENT_ID')
        document_id = data.get('DOCUMENT_ID')

        # Check if the same document has already been submitted by this student
        if STUDENT_DOCUMENTS.objects.filter(STUDENT_ID=student_id, DOCUMENT_ID=document_id).exists():
            return Response(
                {"detail": "This document has already been submitted by the student."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
