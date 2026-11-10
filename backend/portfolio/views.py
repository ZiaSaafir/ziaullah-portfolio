import smtplib

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import generics, permissions, status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import Article, Profile, Project, Skill
from .serializers import (
    ArticleSerializer,
    ContactMessageSerializer,
    ProfileSerializer,
    ProjectSerializer,
    SkillSerializer,
)


class EmailDeliveryError(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Message saved, but email delivery failed. Please use the email link instead."


class PublicProjectList(generics.ListAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.filter(published=True)


class AdminProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Project.objects.all()


class AdminProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Project.objects.all()


class PublicArticleList(generics.ListAPIView):
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(published=True)


class PublicArticleDetail(generics.RetrieveAPIView):
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(published=True, kind=Article.Kind.ORIGINAL)
    lookup_field = "slug"


class AdminArticleList(generics.ListCreateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Article.objects.all()


class AdminArticleDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Article.objects.all()


class PublicProfile(APIView):
    def get(self, request):
        profile = Profile.objects.first()
        if profile is None:
            return Response({})
        return Response(ProfileSerializer(profile, context={"request": request}).data)


class PublicSkillList(generics.ListAPIView):
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()


class ContactRateThrottle(AnonRateThrottle):
    scope = "contact"


class ContactSubmission(APIView):
    throttle_classes = [ContactRateThrottle]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        email_configured = all(
            [settings.EMAIL_HOST, settings.DEFAULT_FROM_EMAIL, settings.CONTACT_RECIPIENT_EMAIL]
        )

        if email_configured:
            try:
                EmailMessage(
                    subject=f"Portfolio contact: {message.subject}",
                    body=f"From: {message.name} <{message.email}>\n\n{message.message}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.CONTACT_RECIPIENT_EMAIL],
                    reply_to=[message.email],
                ).send(fail_silently=False)
            except (OSError, smtplib.SMTPException):
                raise EmailDeliveryError()
            message.email_sent = True
            message.save(update_fields=["email_sent"])

        return Response(
            {
                "message": "Thanks, your message has been received.",
                "email_configured": email_configured,
            },
            status=status.HTTP_201_CREATED,
        )
