from rest_framework import serializers

from .models import Article, ContactMessage, Profile, Project, Skill


class ProjectSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "name", "slug", "description", "category", "technologies",
            "image", "github_url", "demo_url", "featured", "updated_at",
        ]

    def get_image(self, obj):
        if not obj.image:
            return ""
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class ArticleSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "description", "kind", "platform", "content",
            "cover_image", "category", "tags", "original_url", "published_at",
        ]

    def validate(self, attrs):
        kind = attrs.get("kind", getattr(self.instance, "kind", Article.Kind.ORIGINAL))
        original_url = attrs.get("original_url", getattr(self.instance, "original_url", ""))
        if kind == Article.Kind.EXTERNAL and not original_url:
            raise serializers.ValidationError(
                {"original_url": "External publications must include the original article URL."}
            )
        return attrs

    def get_cover_image(self, obj):
        if not obj.cover_image:
            return ""
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_image.url) if request else obj.cover_image.url


class ProfileSerializer(serializers.ModelSerializer):
    cv = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        exclude = ["id"]

    def get_cv(self, obj):
        if not obj.cv:
            return ""
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cv.url) if request else obj.cv.url

    def get_avatar(self, obj):
        if not obj.avatar:
            return ""
        request = self.context.get("request")
        return request.build_absolute_uri(obj.avatar.url) if request else obj.avatar.url


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "group"]


class ContactMessageSerializer(serializers.ModelSerializer):
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message", "website"]

    def validate_subject(self, value):
        if "\r" in value or "\n" in value:
            raise serializers.ValidationError("Subject must be a single line.")
        return value

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        return ContactMessage.objects.create(**validated_data)
