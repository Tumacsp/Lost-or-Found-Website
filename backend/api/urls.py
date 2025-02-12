from django.urls import path
from .views import ProfileView, PostCreateView, ProfileChangePassword, PostView, Search, PostFoundView

urlpatterns = [
    #profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/change-password/', ProfileChangePassword.as_view(), name='change-password'),

    #post
    path('posts/', PostView.as_view(), name='get-post'),
    path('posts/<int:pk>/', PostView.as_view(), name='get-post-by-id'),
    path('posts/create/', PostCreateView.as_view(), name='post-create'),
    path('posts/edit/<int:post_id>', PostCreateView.as_view(), name='post-update'),
    path('posts/delete/<int:post_id>', PostCreateView.as_view(), name='post-delete'),
    path('posts/found/<int:post_id>', PostFoundView.as_view(), name="post-found"),

    #search post
    path('search/<str:terms>', Search.as_view(), name='get-post-by-title'),
    path('search/', Search.as_view(), name='get-post-by-title')
]
