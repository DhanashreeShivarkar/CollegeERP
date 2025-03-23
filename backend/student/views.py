from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.core.mail import send_mail
from .models import STUDENT_MASTER, BRANCH
from .serializers import StudentMasterSerializer
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

logger = logging.getLogger(__name__)

class StudentMasterViewSet(viewsets.ModelViewSet):
    queryset = STUDENT_MASTER.objects.filter(IS_DELETED=False)
    serializer_class = StudentMasterSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Debug prints
            print("=== Student Creation Debug ===")
            print("Request data:", request.data)
            print("Content type:", request.content_type)
            print("Headers:", request.headers)

            logger.info("=== Starting Student Creation Process ===")
            logger.debug(f"Incoming request data: {request.data}")

            branch_id = request.data.get('BRANCH_ID')
            if not branch_id:
                return Response({'error': 'BRANCH_ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            branch_obj = BRANCH.objects.select_related('PROGRAM').get(BRANCH_ID=branch_id)
            if not branch_obj:
                return Response({'error': f"BRANCH_ID {branch_id} not found"},
                              status=status.HTTP_400_BAD_REQUEST)

            batch = request.data.get('BATCH')
            if not batch:
                return Response({'error': 'BATCH is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate Student ID
            student_id = generate_student_id(branch_obj.PROGRAM.CODE, batch)

            # Create request data with generated ID
            student_data = request.data.copy()
            student_data['STUDENT_ID'] = student_id
            student_data['IS_ACTIVE'] = True

            serializer = self.get_serializer(data=student_data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            student = serializer.save()
            logger.info(f"Created student with ID: {student_id}")

            # After successful student creation, create user account
            try:
                # Get student designation
                student_designation = DESIGNATION.objects.get(CODE='STUDENT')
                
                # Generate username from email
                email = student_data.get('EMAIL_ID')
                username = email.split('@')[0]
                
                # Generate random password
                password = generate_password(8)
                
                # Create user account
                User = get_user_model()
                user = User.objects.create(
                    USER_ID=student_id,
                    USERNAME=username,
                    EMAIL=email,
                    FIRST_NAME=student_data.get('NAME', ''),
                    DESIGNATION=student_designation,
                    IS_ACTIVE=True
                )
                user.set_password(password)
                user.save()

                # Send credentials via email
                email_body = f"""
                Dear {student_data.get('NAME')},

                Your student account has been created successfully.
                Please use the following credentials to login:

                User ID: {student_id}
                Username: {username}
                Password: {password}

                Please change your password after first login.

                Best regards,
                College ERP Team
                """

                send_mail(
                    subject='College ERP - Login Credentials',
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )

                return Response({
                    'message': 'Student created successfully with user account',
                    'student_id': student_id,
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)

            except Exception as user_error:
                # If user creation fails, log error but don't fail student creation
                logger.error(f"Error creating user account: {str(user_error)}")
                return Response({
                    'message': 'Student created but user account creation failed',
                    'student_id': student_id,
                    'error': str(user_error),
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error in create: {str(e)}")
            logger.error(f"Error in create process: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            # Get query parameters
            page = int(request.query_params.get('page', 1))
            limit = int(request.query_params.get('limit', 10))
            batch = request.query_params.get('batch')
            branch = request.query_params.get('branch')
            academic_year = request.query_params.get('academicYear')

            # Apply filters
            queryset = self.queryset
            if batch:
                queryset = queryset.filter(BATCH=batch)
            if branch:
                queryset = queryset.filter(BRANCH_ID=branch)
            if academic_year:
                queryset = queryset.filter(ACADEMIC_YEAR=academic_year)

            # Calculate pagination
            start = (page - 1) * limit
            end = start + limit
            total = queryset.count()

            # Get paginated data
            students = queryset[start:end]
            serializer = self.get_serializer(students, many=True)

            return Response({
                'status': 'success',
                'total': total,
                'page': page,
                'limit': limit,
                'data': serializer.data
            })

        except Exception as e:
            logger.error(f"Error listing students: {str(e)}")
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
