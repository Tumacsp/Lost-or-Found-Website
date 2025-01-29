from rest_framework.exceptions import APIException
from rest_framework import status

class CustomError(APIException):
    def __init__(self, detail=None, code=None):
        super().__init__(detail, code)
        self.status_code = code if code else status.HTTP_400_BAD_REQUEST
        self.detail = {
            'message': detail
        }

        