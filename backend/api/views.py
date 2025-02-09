from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .errors import CustomError
from .serializers import UserProfileSerializer, PostSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from .models import *

class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            profile, created = Profile.objects.get_or_create(user=request.user)

            print("🔍 User:", request.user.username)
            print("📸 Profile picture:", profile.picture if profile.picture else "No picture")

            # ใช้ serializer พร้อม context เพื่อให้ request ถูกส่งเข้าไป
            serializer = UserProfileSerializer(request.user, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"detail": "Failed to fetch profile data", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            profile, created = Profile.objects.get_or_create(user=request.user)
    
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)

            if serializer.is_valid():
                # จัดการอัพโหลดรูปภาพ
                if 'profile_picture' in request.FILES:
                    #ลบรูปเก่า
                    if profile.picture:
                        profile.picture.delete()
                    #อัพรูปใหม่
                    profile.picture = request.FILES['profile_picture']
                    profile.save()

                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        
            print("❌ Validation Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("❌ Server Error:", str(e))
            raise CustomError(
                detail={"non_field_errors": ["Failed to update profile"]},
                code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileChangePassword(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Handle password change"""
        try:
            user = request.user
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')

            if not old_password or not new_password:
                return Response(
                    {"message": "Both old and new password are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate old password
            if not user.check_password(old_password):
                return Response(
                    {"message": "Current password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(new_password)
            user.save()

            # Delete old token and create new one
            Token.objects.filter(user=user).delete()

            return Response({
            "message": "Password changed successfully. Please login again."
        }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"message": "Failed to change password"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, *args, **kwargs):
        try:
            data = {
                'title': request.data.get('title'),
                'body_text': request.data.get('details'),
                'category': request.data.get('type'),
                'location': {
                    'latitude': request.data.get('latitude'),
                    'longitude': request.data.get('longitude')
                },
                'reward': request.data.get('reward'),
                'status': 'active'
            }
            
            # Handle image upload if present
            if 'picture_name' in request.FILES:
                data['picture_name'] = request.FILES['picture_name']

            # สร้าง serializer พร้อมส่ง request ใน context
            serializer = PostSerializer(data=data, context={'request': request})
            
            if serializer.is_valid():
                post = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print("Serializer errors:", serializer.errors)  # Debug line
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("Error creating post:", str(e))  # Debug line
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
class PostView(APIView):
    def get(self, request, pk=None):
        if pk is None:
            posts = Post.objects.filter(status='active')
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data)
        else:
            post = get_object_or_404(Post, pk=pk)
            serializer = PostSerializer(post, context={'request': request})
            return Response(serializer.data)

class Search(APIView):
    def get(self, request, terms=None):
        if terms is None:
            posts = Post.objects.filter(status='active')
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data)
        else:
            posts = Post.objects.filter(title__icontains=terms) | Post.objects.filter(body_text__icontains=terms)
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data)
