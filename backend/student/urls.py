from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentMasterViewSet, StudentRollNumberDetailsViewSet

router = DefaultRouter()
router.register('student', StudentMasterViewSet, basename='student')  # Changed from '' to 'student'
router.register('student/rollnumbers', StudentRollNumberDetailsViewSet, basename='rollnumbers')  # Added this line

from . import views
from .views import StudentMasterViewSet

router = DefaultRouter()
router.register('student', StudentMasterViewSet, basename='student')  # Changed from '' to 'student'
router.register(r'master/checklist', views.CheckListDocumnetsCreateView, basename='checklist')
router.register(r'master/document-submission', views.StudentDocumentsViewSet, basename='student-documents')

urlpatterns = [
    path('', include(router.urls)),  # Changed from 'student/' to ''
   
]
