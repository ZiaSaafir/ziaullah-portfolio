from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from .models import Article, ContactMessage, Project
from .serializers import ArticleSerializer


class PublicPortfolioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_seeded_public_content_is_available(self):
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 6)

        profile = self.client.get("/api/profile/")
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.data["name"], "Ziaullah Saafir")
        self.assertIn("FAST University", profile.data["education"])

        skills = self.client.get("/api/skills/")
        self.assertEqual(skills.status_code, 200)
        self.assertTrue(any(skill["name"] == "Python" for skill in skills.data))

    def test_unpublished_projects_and_articles_are_not_public(self):
        Project.objects.create(name="Private preview", published=False)
        article = Article.objects.create(
            title="Draft notes",
            slug="draft-notes",
            kind=Article.Kind.ORIGINAL,
            content="Not public yet",
            published=False,
        )

        projects = self.client.get("/api/projects/")
        articles = self.client.get("/api/articles/")
        detail = self.client.get(f"/api/articles/{article.slug}/")

        self.assertEqual(len(projects.data), 6)
        self.assertEqual(articles.data, [])
        self.assertEqual(detail.status_code, 404)

    def test_published_original_article_has_a_readable_detail_page(self):
        article = Article.objects.create(
            title="Learning notes",
            slug="learning-notes",
            description="A short development note.",
            kind=Article.Kind.ORIGINAL,
            content="## What I learned\n\nSmall steps add up.",
            published=True,
        )

        response = self.client.get(f"/api/articles/{article.slug}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["content"], article.content)

    def test_external_articles_require_their_source_url(self):
        serializer = ArticleSerializer(
            data={"title": "External note", "kind": Article.Kind.EXTERNAL}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("original_url", serializer.errors)

    def test_external_article_platform_is_detected_from_known_source_urls(self):
        medium_article = Article.objects.create(
            title="Medium article",
            kind=Article.Kind.EXTERNAL,
            original_url="https://zia.medium.com/my-post",
        )
        linkedin_article = Article.objects.create(
            title="LinkedIn article",
            kind=Article.Kind.EXTERNAL,
            original_url="https://www.linkedin.com/pulse/my-post",
        )

        self.assertEqual(medium_article.platform, "Medium")
        self.assertEqual(linkedin_article.platform, "LinkedIn")

    def test_contact_form_validates_and_stores_submission(self):
        invalid = self.client.post(
            "/api/contact/",
            {"name": "Zia", "email": "not-an-email", "subject": "Hello", "message": "Hi"},
            format="json",
        )
        self.assertEqual(invalid.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

        invalid_subject = self.client.post(
            "/api/contact/",
            {"name": "Zia", "email": "visitor@example.net", "subject": "Hello\nBcc: other@example.net", "message": "Hi"},
            format="json",
        )
        self.assertEqual(invalid_subject.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

        response = self.client.post(
            "/api/contact/",
            {
                "name": "Visitor",
                "email": "visitor@example.net",
                "subject": "A question",
                "message": "I'd like to connect.",
                "website": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["email_configured"])
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_project_images_are_resized_and_converted_to_webp(self):
        source = BytesIO()
        Image.new("RGB", (2000, 1400), color="green").save(source, format="PNG")

        with TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                project = Project.objects.create(
                    name="Image optimization test",
                    image=SimpleUploadedFile("preview.png", source.getvalue(), content_type="image/png"),
                )
                with Image.open(project.image) as optimized:
                    self.assertEqual(optimized.format, "WEBP")
                    self.assertLessEqual(optimized.width, 1600)
                    self.assertLessEqual(optimized.height, 1200)


class AdminPortfolioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_content_management_requires_staff_authentication(self):
        self.assertEqual(self.client.get("/api/manage/projects/").status_code, 403)

        user = get_user_model().objects.create_user(
            username="portfolio-admin",
            password="test-only-password",
            is_staff=True,
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/manage/projects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 6)
