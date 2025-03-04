from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('verify-token/', views.verify_reset_token, name='verify_reset_token'),
    path('reset-password/', views.reset_password, name='reset_password'),
]
