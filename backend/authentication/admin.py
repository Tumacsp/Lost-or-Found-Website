from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff',)
    
    fieldsets = (
        (None, {'fields': ('username', 'email')}),
        ('Permissions', {
            'fields': ('is_staff', 'is_active'),
        }),
        ('Password Reset', {
            'fields': ('password',),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active'),
        }),
    )

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
