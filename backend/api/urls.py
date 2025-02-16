from django.urls import path
from .views import *

urlpatterns = [
    #users
    path('users/', DashboardUser.as_view(), name='get-all-users'),

    #profile
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/change-password/', ProfileChangePassword.as_view(), name='change-password'),

    #post
    path('posts/', PostView.as_view(), name='get-post'),
    path('posts/<int:pk>/', PostView.as_view(), name='get-post-by-id'),
    path('posts/all', PostView.as_view(), name='get-all-post'),
    path('posts/create/', PostCreateView.as_view(), name='post-create'),
    path('posts/edit/<int:post_id>', PostCreateView.as_view(), name='post-update'),
    path('posts/delete/<int:post_id>', PostCreateView.as_view(), name='post-delete'),
    path('posts/found/<int:post_id>', PostFoundView.as_view(), name="post-found"),

    #search post
    path('search/<str:terms>', Search.as_view(), name='get-post-by-title'),
    path('search/', Search.as_view(), name='get-post-by-title'),

    #bookmark
    path('bookmark/<int:post_id>', BookmarkView.as_view(), name=''),
    path('bookmark/', BookmarkView.as_view(), name=''),

    #dashboard
    path('dashboard/stats/', DashboardStatsAPI.as_view(), name='dashboard-stats'),
]
