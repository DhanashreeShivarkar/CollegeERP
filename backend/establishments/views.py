from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import TYPE_MASTER, STATUS_MASTER, SHIFT_MASTER
from .serializers import TypeMasterSerializer, StatusMasterSerializer, ShiftMasterSerializer
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
        if auth_header.startswith('Username '):
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
