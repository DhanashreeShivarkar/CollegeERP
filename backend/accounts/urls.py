from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('send-otp/', views.SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify_otp'),
    # Add these new URLs for password reset
    path('request-password-reset/', views.RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('verify-reset-otp/', views.VerifyResetOTPView.as_view(), name='verify_reset_otp'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password'),
]
