from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('send-otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('request-password-reset/', views.RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('verify-reset-otp/', views.VerifyResetOTPView.as_view(), name='verify-reset-otp'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
]
