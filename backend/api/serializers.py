from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This email is already registered."
        )]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        read_only_fields = ['email']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError(
                {"username": ["This username is already taken."]}
            )
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
