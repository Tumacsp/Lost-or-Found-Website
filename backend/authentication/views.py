from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .models import PasswordResetToken
from .utils import generate_token, send_reset_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'message': 'Registration successful.'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'errors': serializer.errors,
        'message': 'Invalid registration data'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'message': 'Login successful.'
        })
    print("Login Errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK) 
    except Exception as e:
        return Response({
            'message': 'Error during logout',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        
        token = generate_token()
        PasswordResetToken.objects.create(
            user=user,
            token=token
        )
        
        # ส่งอีเมล
        send_reset_email(email, token)
        
        return Response({
            'message': 'Password reset instructions have been sent to your email'
        })
        
    except User.DoesNotExist:
        # ส่งข้อความเดียวกันเพื่อความปลอดภัย
        return Response({
            'message': 'Password reset instructions have been sent to your email'
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_token(request):
    token = request.data.get('token')
    if not token:
        return Response({
            'message': 'Token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        reset_token = PasswordResetToken.objects.get(
            token=token,
            is_used=False
        )
        
        if reset_token.is_valid():
            return Response({
                'message': 'Token verified successfully',
                'token': token  # ส่ง token กลับไปใช้ในหน้า reset password
            })
        else:
            return Response({
                'message': 'Token has expired',
                'error': 'TOKEN_EXPIRED'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except PasswordResetToken.DoesNotExist:
        return Response({
            'message': 'Invalid verification code',
            'error': 'INVALID_TOKEN'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not token or not new_password:
        return Response({
            'message': 'Token and new password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ตรวจสอบความปลอดภัยของรหัสผ่าน
        validate_password(new_password)
        
        reset_token = PasswordResetToken.objects.get(
            token=token,
            is_used=False
        )
        
        if not reset_token.is_valid():
            return Response({
                'message': 'Token has expired',
                'error': 'TOKEN_EXPIRED'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # เปลี่ยนรหัสผ่าน
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.save()
        
        return Response({
            'message': 'Password has been reset successfully'
        })
        
    except PasswordResetToken.DoesNotExist:
        return Response({
            'message': 'Invalid verification code',
            'error': 'INVALID_TOKEN'
        }, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({
            'message': ' '.join(e.messages),
            'error': 'INVALID_PASSWORD'
        }, status=status.HTTP_400_BAD_REQUEST)
