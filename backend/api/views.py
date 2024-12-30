from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class MyDataView(APIView):
    def get(self, request):
        # ข้อมูลที่จะแสดงผล
        data = {"message": "Hello from Django API!"}
        
        # ส่งข้อมูลเป็น JSON กลับไปที่ client
        return Response(data, status=status.HTTP_200_OK)
