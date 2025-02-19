from django.contrib import admin
from .models import Post, Bookmark
from django.utils.html import format_html

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'display_picture', 'category', 'status', 'reward', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ['title', 'body_text', 'user__username']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    list_per_page = 50
    ordering = ['-created_at']
    
    def display_picture(self, obj):
        if obj.picture_name:
            return format_html('<img src="{}" width="150" height="100" />', obj.picture_name.url)
        return "-"
    display_picture.short_description = 'Picture'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'body_text', 'picture_name')
        }),
        ('Location & Category', {
            'fields': ('location', 'category')
        }),
        ('Status & Reward', {
            'fields': ('status', 'reward')
        }),
        ('User Information', {
            'fields': ('user', 'created_at')
        }),
    )

    actions = ['make_active', 'make_inactive', 'make_resolved']

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post')
    list_filter = ('user',)
    search_fields = ['user__username', 'post__title']
    autocomplete_fields = ['user', 'post']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'post')
