from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentMasterViewSet, StudentRollNumberDetailsViewSet

router = DefaultRouter()
router.register('student', StudentMasterViewSet, basename='student')  # Changed from '' to 'student'
router.register('student/rollnumbers', StudentRollNumberDetailsViewSet, basename='rollnumbers')  # Added this line
urlpatterns = [
    path('', include(router.urls)),  # Changed from 'student/' to ''
   
]
