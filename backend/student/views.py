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
from utils.id_generators import generate_employee_id, generate_password
import logging
from my_project.logger import logger
from utils import generate_student_id 
from django.http import Http404
from django.utils import timezone
from django.db.models import Q
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
import os
from utils.id_generators import generate_student_id

# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = StudentMasterSerializer
    queryset = STUDENT_MASTER.objects.filter(ACTIVE='YES')
    lookup_field = 'STUDENT_ID'
    lookup_url_kwarg = 'pk'

    def create(self, request, *args, **kwargs):
        try:
            logger.info("=== Starting Student Creation Process ===")

            # Generate Student ID
            branch_obj = BRANCH.objects.get(BRANCH_ID=request.data.get('BRANCH_ID'))
            batch = request.data.get('BATCH')
            student_id = generate_student_id(branch_obj.PROGRAM_CODE, batch)

            student_data = {key: request.data.get(key) for key in request.data.keys()}
            student_data['STUDENT_ID'] = student_id
            student_data['ACTIVE'] = 'YES'

            serializer = self.get_serializer(data=student_data)
            if not serializer.is_valid():
                return Response({'error': 'Validation failed', 'details': serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)

            student = serializer.save()

            return Response({
                'message': 'Student created successfully',
                'student_id': student.STUDENT_ID,
                'student_data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error in create process: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('query', '')
        if not query:
            return Response({'error': 'Search query is required'},
                             status=status.HTTP_400_BAD_REQUEST)

        students = STUDENT_MASTER.objects.filter(
            Q(STUDENT_ID__icontains=query) |
            Q(NAME__icontains=query) |
            Q(SURNAME__icontains=query) |
            Q(BRANCH_ID__PROGRAM_CODE__icontains=query),
            ACTIVE='YES'
        ).select_related('BRANCH_ID')[:10]

        data = [
            {
                'STUDENT_ID': student.STUDENT_ID,
                'NAME': student.NAME,
                'SURNAME': student.SURNAME,
                'BRANCH': student.BRANCH_ID.PROGRAM_CODE,
            } for student in students
        ]

        return Response(data)

    def retrieve(self, request, pk=None):
        try:
            student = get_object_or_404(STUDENT_MASTER, STUDENT_ID=pk, ACTIVE='YES')
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': f'Error retrieving student: {str(e)}'},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            update_data = {key: request.data.get(key) for key in request.data.keys() if key != 'STUDENT_ID'}

            serializer = self.get_serializer(instance, data=update_data, partial=True)

            if not serializer.is_valid():
                return Response({'error': 'Validation failed', 'details': serializer.errors},
                                status=status.HTTP_400_BAD_REQUEST)

            updated_student = serializer.save()

            return Response({'message': 'Student updated successfully', 'data': serializer.data})
        except Http404:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating student: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_branch(self, request, branch_id=None):
        try:
            students = STUDENT_MASTER.objects.filter(BRANCH_ID=branch_id).values('STUDENT_ID')
            return Response(students)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
