from urllib.parse import urlsplit

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.db import models
from django.utils.text import slugify

from .images import optimize_uploaded_image


class Project(models.Model):
    class Category(models.TextChoices):
        FULL_STACK = "full-stack", "Full-Stack"
        BACKEND = "backend", "Backend"
        FRONTEND = "frontend", "Frontend"
        AI_ML = "ai-ml", "AI / ML"
        OTHER = "other", "Other"

    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER)
    technologies = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to="projects/", blank=True)
    github_url = models.URLField(blank=True, validators=[URLValidator()])
    demo_url = models.URLField(blank=True, validators=[URLValidator()])
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-featured", "-updated_at", "name"]

    def save(self, *args, **kwargs):
        optimize_uploaded_image(self.image)
        if not self.slug:
            base_slug = slugify(self.name) or "project"
            slug = base_slug
            suffix = 2
            while Project.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{suffix}"
                suffix += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Article(models.Model):
    class Kind(models.TextChoices):
        ORIGINAL = "original", "My Article"
        EXTERNAL = "external", "External Publication"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.CharField(max_length=320, blank=True)
    kind = models.CharField(max_length=12, choices=Kind.choices, default=Kind.ORIGINAL)
    platform = models.CharField(
        max_length=80,
        blank=True,
        help_text="Optional. LinkedIn or Medium is detected automatically from the source URL when left blank.",
    )
    content = models.TextField(blank=True, help_text="Markdown supported for original articles.")
    cover_image = models.ImageField(upload_to="articles/", blank=True)
    category = models.CharField(max_length=80, blank=True)
    tags = models.JSONField(default=list, blank=True)
    original_url = models.URLField(blank=True, validators=[URLValidator()])
    published_at = models.DateField(null=True, blank=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def clean(self):
        if self.kind == self.Kind.EXTERNAL and not self.original_url:
            raise ValidationError({"original_url": "External publications must include the original article URL."})

    def save(self, *args, **kwargs):
        optimize_uploaded_image(self.cover_image)
        if self.kind == self.Kind.EXTERNAL and not self.platform.strip():
            hostname = urlsplit(self.original_url).hostname or ""
            hostname = hostname.lower().removeprefix("www.")
            if hostname == "medium.com" or hostname.endswith(".medium.com"):
                self.platform = "Medium"
            elif hostname == "linkedin.com" or hostname.endswith(".linkedin.com") or hostname == "lnkd.in":
                self.platform = "LinkedIn"
        if not self.slug:
            base_slug = slugify(self.title) or "article"
            slug = base_slug
            suffix = 2
            while Article.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{suffix}"
                suffix += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Profile(models.Model):
    name = models.CharField(max_length=120, default="Ziaullah Saafir")
    headline = models.CharField(max_length=180, default="Building Practical Solutions Through Code.")
    introduction = models.TextField(blank=True)
    about = models.TextField(blank=True)
    education = models.CharField(max_length=180, default="BS Computer Science · FAST University, Peshawar Campus")
    interests = models.JSONField(default=list, blank=True)
    avatar = models.ImageField(upload_to="profile/", blank=True)
    email = models.EmailField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    cv = models.FileField(upload_to="documents/", blank=True)
    availability_label = models.CharField(max_length=80, blank=True)
    availability_enabled = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        optimize_uploaded_image(self.avatar)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Skill(models.Model):
    class Group(models.TextChoices):
        LANGUAGES = "languages", "Programming Languages"
        FRONTEND = "frontend", "Frontend Development"
        BACKEND = "backend", "Backend Development"
        DATABASES = "databases", "Databases"
        AI_ML = "ai-ml", "AI & Machine Learning"
        TOOLS = "tools", "Development Tools"

    name = models.CharField(max_length=80)
    group = models.CharField(max_length=20, choices=Group.choices)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["group", "sort_order", "name"]
        unique_together = [("name", "group")]

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=180)
    message = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    email_sent = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} — {self.name}"
