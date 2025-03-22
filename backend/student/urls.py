from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views


router = DefaultRouter()
router.register(r'studentMaster/student', views.StudentViewSet, basename = 'student')

app_name = 'student'

# Correct URL Patterns
urlpatterns = [
    path('', include(router.urls)),
    # path('api/', include(router.urls)),
    # path('api/studentMaster/student', include(router.urls)),
]
