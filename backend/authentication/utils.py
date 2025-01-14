from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid

def generate_token():
    return str(uuid.uuid4())

def send_reset_email(user_email, token):
    # ดึงข้อมูล user จาก email
    from django.contrib.auth.models import User
    user = User.objects.get(email=user_email)
    
    # สร้าง context สำหรับ template
    context = {
        'user': user,
        'token': token
    }
    
    # สร้าง HTML email
    html_message = render_to_string(
        'emails/reset_password.html',
        context
    )
    
    # สร้าง plain text version
    plain_message = strip_tags(html_message)
    
    # ส่งอีเมล
    send_mail(
        subject='Reset Your Password - Verification Code',
        message=plain_message,
        from_email='noreply@yourapp.com',
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False,
    )