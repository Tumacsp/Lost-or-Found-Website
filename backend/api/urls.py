from django.urls import path
from .views import ProfileView, PostCreateView, ProfileChangePassword
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/change-password/', ProfileChangePassword.as_view(), name='change-password'),
    path('posts/create/', PostCreateView.as_view(), name='post-create'),
]
