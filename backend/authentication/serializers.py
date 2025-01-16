from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
import re

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required.',
            'invalid': 'Please enter a valid email address.'
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.'
        }
    )

    def validate_email(self, value):
        # Convert email to lowercase for consistency
        value = value.lower()
        
        # Check email format using regex
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError('Invalid email format.')
        
        return value

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                user = authenticate(
                    username=user.username,
                    password=password
                )
                if not user:
                    raise serializers.ValidationError({
                        'non_field_errors': ['Incorrect email or password.']
                    })
                if not user.is_active:
                    raise serializers.ValidationError({
                        'non_field_errors': ['This account has been disabled.']
                    })
            except User.DoesNotExist:
                raise serializers.ValidationError({
                    'non_field_errors': ['No account found with this email.']
                })
        else:
            raise serializers.ValidationError({
                'non_field_errors': ['Must include "email" and "password".']
            })

        data['user'] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required.',
            'invalid': 'Please enter a valid email address.'
        },
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this email already exists."
            )
        ]
    )
    username = serializers.CharField(
        required=True,
        validators=[
            RegexValidator(
                regex='^[a-zA-Z0-9_]*$',
                message='Username can only contain letters, numbers, and underscores.',
                code='invalid_username'
            )
        ],
        error_messages={
            'required': 'Username is required.'
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.'
        }
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password confirmation is required.'
        }
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        # Convert email to lowercase
        value = value.lower()
        
        # Check email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError('Invalid email format.')
        
        # Check if email already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        
        return value

    def validate_username(self, value):
        # Convert username to lowercase
        value = value.lower()
        
        # Check username length
        if len(value) < 3:
            raise serializers.ValidationError('Username must be at least 3 characters long.')
        if len(value) > 30:
            raise serializers.ValidationError('Username cannot exceed 30 characters.')
        
        # Check if username already exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        
        return value

    def validate_password(self, value):
        # Password strength validation
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long.')
        
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError('Password must contain at least one number.')
            
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError('Password must contain at least one uppercase letter.')
            
        if not any(char.islower() for char in value):
            raise serializers.ValidationError('Password must contain at least one lowercase letter.')

        return value

    def validate(self, data):
        # Check if passwords match
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': ['Passwords do not match.']
            })
        
        return data

    def create(self, validated_data):
        # Remove password_confirm from validated data
        validated_data.pop('password_confirm', None)
        
        # Create user with validated data
        user = User.objects.create_user(
            username=validated_data['username'].lower(),
            email=validated_data['email'].lower(),
            password=validated_data['password']
        )
        
        return user
