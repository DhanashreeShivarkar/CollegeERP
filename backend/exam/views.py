from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import COLLEGE_EXAM_TYPE
from .serializers import CollegeExamTypeSerializer

class CollegeExamTypeViewSet(viewsets.ModelViewSet): 
    """
    API endpoint that allows users to view or edit college exam types.
    """
    queryset = COLLEGE_EXAM_TYPE.objects.filter(IS_DELETED=False)  # Only show non-deleted records
    serializer_class = CollegeExamTypeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        username = getattr(user, "USERNAME", "UnknownUser")
        print(f"=== Debug Create by {username} ===")

        instance = serializer.save()
        instance.CREATED_BY = str(username)
        instance.UPDATED_BY = str(username)
        instance.save()

    def perform_update(self, serializer):
        user = self.request.user
        username = getattr(user, "USERNAME", "UnknownUser")
        print(f"=== Debug Update by {username} ===")

        instance = serializer.save()
        instance.UPDATED_BY = str(username)
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        username = getattr(user, "USERNAME", "UnknownUser")
        print(f"=== Soft Delete by {username} ===")

        instance.IS_DELETED = True
        instance.DELETED_BY = str(username)
        instance.DELETED_AT = timezone.now()
        instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
