from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .errors import CustomError
from .serializers import UserProfileSerializer, PostSerializer, BookmarkSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action, api_view
from rest_framework.authtoken.models import Token
from .models import *
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone
from django.db.models.functions import TruncDate
from django.db import transaction

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

    def get(self, request):
        posts = Post.objects.all().order_by('title')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

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
    
    def put(self, request, post_id, *args, **kwargs):
        try:
            print("Request Data:", request.data)  # ตรวจสอบค่าที่ส่งมาใน request
            print("Request Files:", request.FILES)  # ดูว่ามีไฟล์อัปโหลดมาหรือไม่

            post = get_object_or_404(Post, id=post_id)
            
            if post.user != request.user:
                return Response(
                    {'error': 'You do not have permission to edit this post'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            data = {
                'title': request.data.get('title'),
                'body_text': request.data.get('body_text'),
                'category': request.data.get('category'),
                'reward': request.data.get('reward'),
                'status': request.data.get('status'),
                'location': {
                    'latitude': request.data.get('latitude'),
                    'longitude': request.data.get('longitude')
                }
            }

            # Handle image upload if present
            if 'picture_name' in request.FILES:
                # ลบรูปเก่าถ้ามี
                if post.picture_name:
                    post.picture_name.delete()
                data['picture_name'] = request.FILES['picture_name']

            serializer = PostSerializer(post, data=data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                post = serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Error updating post:", str(e))
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
    def delete(self, request, post_id, *args, **kwargs):
        try:
            # หา post ที่ต้องการลบ
            post = get_object_or_404(Post, id=post_id)
            
            # ตรวจสอบว่าผู้ใช้เป็นเจ้าของ post
            if post.user != request.user:
                return Response(
                    {'error': 'You do not have permission to delete this post'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # ลบรูป
            if post.picture_name:
                post.picture_name.delete()
            post.delete()
            return Response(
                {'message': 'Post deleted successfully'}, 
                status=status.HTTP_204_NO_CONTENT
            )

        except Exception as e:
            print("Error deleting post:", str(e))
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
        
class PostFoundView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            with transaction.atomic():
                post = get_object_or_404(Post, id=post_id)
                
                # Check if user is NOT the owner
                if post.user != request.user:
                    return Response(
                        {'error': 'Only the post owner can mark it as found'},
                        status=status.HTTP_403_FORBIDDEN
                    )

                if post.status != 'active':
                    return Response(
                        {'error': 'This post is no longer active'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update post status to resolved
                post.status = 'resolved'
                post.save()
                
                return Response({
                    'message': 'Successfully marked as found',
                    'marked_by': request.user.username,
                    'marked_at': timezone.now()
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
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

class BookmarkView(APIView):
    def get(self, request, post_id=None):
        """get an array of posts"""
        if post_id is None:
            user = request.user
            bookmarks = Bookmark.objects.filter(user=user).select_related('post')
            posts = [bookmark.post for bookmark in bookmarks]
            serializer = PostSerializer(posts, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            if(not request.user.is_anonymous):
                user = request.user
                post = Post.objects.get(pk=post_id)
                bookmark_exists = Bookmark.objects.filter(post=post, user=user).exists()
                if bookmark_exists:
                    return Response({"bookmarked": True}, status=status.HTTP_200_OK)
                else:
                    return Response({"bookmarked": False}, status=status.HTTP_200_OK)
            else:
                return Response({"bookmarked": False}, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        """mark a post as bookmarked"""
        post = Post.objects.get(pk=post_id)
        user = request.user
        bookmark, created = Bookmark.objects.get_or_create(post=post, user=user)
        if created:
            return Response({"message": "Bookmark added."}, status=status.HTTP_201_CREATED)
        return Response({"message": "Bookmark already exists."}, status=status.HTTP_200_OK)

    def delete(self, request, post_id):
        """unmarked a post as bookmarked"""
        user = request.user
        bookmark = Bookmark.objects.filter(post_id=post_id, user=user).first()

        if bookmark:
            bookmark.delete()
            return Response({"message": "Bookmark removed."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

class DashboardStatsAPI(APIView):
    def get(self, request):
        try:
            # ข้อมูลพื้นฐาน
            total_users = User.objects.count()
            total_posts = Post.objects.count()
            active_posts = Post.objects.filter(status='active').count()
            resolved_posts = Post.objects.filter(status='resolved').count()

            # ดึงข้อมูล 7 วันล่าสุด
            end_date = timezone.now()
            start_date = end_date - timedelta(days=7)

            daily_stats = Post.objects.filter(
                created_at__gte=start_date,
                created_at__lte=end_date
            ).annotate(
                date=TruncDate('created_at')
            ).values('date').annotate(
                posts=Count('id')
            ).order_by('date')

            date_list = []
            current_date = start_date.date()
            while current_date <= end_date.date():
                posts_count = next(
                    (item['posts'] for item in daily_stats if item['date'] == current_date),
                    0
                )
                date_list.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'posts': posts_count
                })
                current_date += timedelta(days=1)

            return Response({
                'overview': {
                    'totalUsers': total_users,
                    'totalPosts': total_posts,
                    'activePosts': active_posts,
                    'resolvedPosts': resolved_posts,
                },
                'dailyStats': date_list
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class DashboardUser(APIView):
    def get(self, request):
        users = User.objects.select_related('profile').filter(is_staff=False)
        serializer = UserProfileSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

class BanUser(APIView):
    
    def put(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
            
            if not user.is_active:
                return Response(
                    {"error": "User is already banned"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.is_active = False
            user.save()
            
            return Response(
                {
                    "message": f"User {user.username} has been banned successfully",
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class BanPost(APIView):
    
    def put(self, request, post_id):
        try:
            post = get_object_or_404(Post, id=post_id)
            
            if post.status == 'inactive':
                return Response(
                    {"error": "Post is already inactive"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            post.status = 'inactive'
            post.save()
            
            return Response(
                {
                    "message": f"Post {post.title} has been set to inactive successfully",
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UnBanUser(APIView):
    
    def put(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
            
            if user.is_active:
                return Response(
                    {"error": "User is not banned"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.is_active = True
            user.save()
            
            return Response(
                {
                    "message": f"User {user.username} has been unbanned successfully",
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UnBanPost(APIView):
    
    def put(self, request, post_id):
        try:
            post = get_object_or_404(Post, id=post_id)
            
            if post.status == 'active':
                return Response(
                    {"error": "Post is already active"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            post.status = 'active'
            post.save()
            
            return Response(
                {
                    "message": f"Post {post.title} has been set to active successfully",
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        