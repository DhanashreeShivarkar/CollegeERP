from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'StudentMaster/StudentInfoForm', views.StudentViewSet, basename='student')

# Correct URL Patterns
urlpatterns = [
    path('api/', include(router.urls)),  # Correct inclusion of router URLs
]
