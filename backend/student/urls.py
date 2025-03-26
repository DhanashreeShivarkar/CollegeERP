from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentMasterViewSet

router = DefaultRouter()
router.register('student', StudentMasterViewSet, basename='student')  # Changed from '' to 'student'

urlpatterns = [
    path('', include(router.urls)),  # Changed from 'student/' to ''
]
