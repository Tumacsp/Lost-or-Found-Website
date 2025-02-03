from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Location(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return f"({self.latitude}, {self.longitude})"

class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

def upload_path(instance, filename):
    return '/'.join(['thumbnail', filename, instance.user])

class Post(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('resolved', 'Resolved')
    ]

    title = models.CharField(max_length=100)
    body_text = models.TextField()
    picture_name = models.ImageField(upload_to=upload_path, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.OneToOneField(Location, on_delete=models.PROTECT)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Bookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

User._meta.get_field('email')._unique = True
