from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .errors import CustomError
from .serializers import UserProfileSerializer

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


