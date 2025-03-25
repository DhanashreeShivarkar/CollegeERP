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
            print("=== Student Creation Debug ===")
            print("Request data:", request.data)
            
            # Check for required fields
            required_fields = [
                'INSTITUTE', 'ACADEMIC_YEAR', 'BATCH', 'ADMISSION_CATEGORY',
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

            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                student = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Student created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

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
