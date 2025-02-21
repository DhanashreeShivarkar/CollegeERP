from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import MasterTableListView, CountryViewSet

router = DefaultRouter()
router.register(r'master/countries', CountryViewSet, basename='country')

app_name = 'accounts'

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.LoginView.as_view(), name='login'),  # Updated path
    path('auth/send-otp/', views.SendOTPView.as_view(), name='send-otp'),  # Updated path
    path('auth/verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),  # Updated path
    path('auth/request-password-reset/', views.RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('auth/verify-reset-otp/', views.VerifyResetOTPView.as_view(), name='verify-reset-otp'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('master/tables/', MasterTableListView.as_view(), name='master-tables'),
]
