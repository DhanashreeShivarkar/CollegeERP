from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'exam/college-exam-type', views.CollegeExamTypeViewSet, basename='college-exam-type')


app_name = 'exam'

urlpatterns = [
    path('', include(router.urls)),
]