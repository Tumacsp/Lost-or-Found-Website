from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .errors import CustomError
from .serializers import UserProfileSerializer, PostSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import *

class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            raise CustomError(
                detail="Failed to fetch profile data",
                code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        
            # print("❌ Validation Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("❌ Server Error:", str(e))
            raise CustomError(
                detail={"non_field_errors": ["Failed to update profile"]},
                code=status.HTTP_500_INTERNAL_SERVER_ERROR
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
            