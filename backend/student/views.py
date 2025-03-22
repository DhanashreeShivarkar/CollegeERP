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

logger = logging.getLogger(__name__)

class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = StudentMasterSerializer
    queryset = STUDENT_MASTER.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            logger.info("=== Starting Student Creation Process ===")
            logger.debug(f"Incoming request data: {request.data}")

            branch_id = request.data.get('BRANCH_ID')
            if not branch_id:
                return Response({'error': 'BRANCH_ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            branch_obj = BRANCH.objects.filter(BRANCH_ID=branch_id).first()
            if not branch_obj:
                return Response({'error': f"BRANCH_ID {branch_id} not found in BRANCHES table"},
                                status=status.HTTP_400_BAD_REQUEST)

            batch = request.data.get('BATCH')
            student_id = generate_student_id(branch_obj.PROGRAM_CODE, batch)

            student_data = {key: request.data.get(key) for key in request.data.keys()}
            student_data['STUDENT_ID'] = student_id
            student_data['ACTIVE'] = True
            student_data['PROGRAM_CODE'] = branch_obj.PROGRAM.CODE  # Add PROGRAM_CODE from BRANCH


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
