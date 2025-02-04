from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

def profile_upload_path(instance, filename):
    return f'/profile_pictures/{instance.user.id}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=profile_upload_path, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'

class Location(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return f"({self.latitude}, {self.longitude})"

def upload_path(instance, filename):
    return '/'.join(['thumbnail', filename, str(instance.user.username)])

class Post(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('resolved', 'Resolved')
    ]
    
    TYPE_CHOICES = [
        ('object', 'Object'),
        ('living', 'Living')
    ]

    title = models.CharField(max_length=100)
    body_text = models.TextField()
    picture_name = models.ImageField(upload_to=upload_path, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.OneToOneField(Location, on_delete=models.PROTECT)
    category = models.CharField(max_length=20, choices=TYPE_CHOICES, default='object')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Bookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

User._meta.get_field('email')._unique = True
