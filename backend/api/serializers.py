from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from .models import Post, Location, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone_number']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
        
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    phone_number = serializers.CharField(source='profile.phone_number', required=False, allow_null=True)

    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This email is already registered."
        )]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'profile_picture', 'phone_number']
        read_only_fields = ['email']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
    
    def validate_phone_number(self, value):
        if value:
            # ลบช่องว่างและตัวอักษรพิเศษออก
            cleaned_number = ''.join(filter(str.isdigit, value))
            
            # ตรวจสอบความยาวเบอร์โทร
            if len(cleaned_number) != 10:
                raise serializers.ValidationError("Phone number must be 10 digits")
            
            # ตรวจสอบว่าขึ้นต้นด้วย 0
            if not cleaned_number.startswith('0'):
                raise serializers.ValidationError("Phone number must start with 0")
            
            # ส่งคืนในรูปแบบที่ต้องการ
            return f"{cleaned_number[0:3]}-{cleaned_number[3:6]}-{cleaned_number[6:]}"
        return value
    
    def get_profile_picture(self, obj):
        if obj.profile.picture:
            request = self.context.get('request')
            picture_url = obj.profile.picture.url

            if request:
                return request.build_absolute_uri(picture_url)
            return picture_url
        
        return None

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile = instance.profile
        if profile_data:
            if 'picture' in profile_data:
                profile.picture = profile_data['picture']
            if 'phone_number' in profile_data:
                profile.phone_number = profile_data['phone_number']
            profile.save()

        return instance

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude']

class PostSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'body_text', 'picture_name', 'location', 
                 'category', 'status', 'created_at', 'user', 'reward']
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
    
    def update(self, instance, validated_data):
        # อัพเดตข้อมูล location ถ้ามีการส่งมา
        if 'location' in validated_data:
            location_data = validated_data.pop('location')
            # อัพเดตข้อมูล location ที่มีอยู่แล้ว
            location = instance.location
            location.latitude = location_data.get('latitude', location.latitude)
            location.longitude = location_data.get('longitude', location.longitude)
            location.save()

        # อัพเดตข้อมูลอื่นๆ ของ post
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    