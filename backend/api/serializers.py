from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from .models import Post, Location, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
        
class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This email is already registered."
        )]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        read_only_fields = ['email']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError(
                {"username": ["This username is already taken."]}
            )
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['picture']

class PostSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'body_text', 'picture_name', 'location', 
                 'category', 'status', 'created_at', 'user']
        read_only_fields = ['created_at', 'user']

    def create(self, validated_data):
        # แยกข้อมูล location ออกมา
        location_data = validated_data.pop('location')
        
        # สร้าง location object
        location = Location.objects.create(**location_data)
        
        # ดึง user จาก context ที่ส่งมาจาก view
        user = self.context['request'].user
        
        # สร้าง post พร้อมกับใส่ user และ location
        post = Post.objects.create(
            location=location,
            user=user,  # เพิ่ม user ตรงนี้
            **validated_data
        )
        return post