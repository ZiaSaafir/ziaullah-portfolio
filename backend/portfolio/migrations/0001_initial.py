from django.db import migrations, models
import django.core.validators


def add_initial_projects(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    Profile = apps.get_model("portfolio", "Profile")
    Skill = apps.get_model("portfolio", "Skill")
    projects = [
        {
            "name": "AI Assistant App",
            "slug": "ai-assistant-app",
            "description": "A beautiful, responsive AI chat application built with React that uses Google's Gemini AI to answer your questions. Features chat history, quick questions, and a clean UI.",
            "category": "ai-ml",
            "technologies": ["React", "Google Gemini"],
            "github_url": "https://github.com/ZiaSaafir/AI-Assistant-App",
            "published": True,
            "featured": True,
        },
        {
            "name": "Agriculture Shop Management & POS",
            "slug": "agriculture-shop-management-pos",
            "description": "Agriculture Shop Management & POS System built with Django REST Framework, React, and PostgreSQL. Includes inventory, flexible units, sales, purchases, customer and supplier ledgers, partial payments, returns, reports, and backup/restore, with a scalable foundation for future multi-branch and SaaS deployment.",
            "category": "full-stack",
            "technologies": ["Django REST Framework", "React", "PostgreSQL"],
            "github_url": "https://github.com/ZiaSaafir/Agriculture-Shop-Management-POS",
            "published": True,
            "featured": True,
        },
        {
            "name": "Clinic Management System API",
            "slug": "clinic-management-system-api",
            "description": "A Django REST Framework based Clinic Management System with patients, doctors, appointments, prescriptions, billing, reports, Swagger API docs, and Bootstrap demo dashboard.",
            "category": "backend",
            "technologies": ["Django REST Framework", "Bootstrap"],
            "github_url": "https://github.com/ZiaSaafir/clinic-management-system-api",
            "published": True,
        },
        {"name": "Full Stack Todo App", "slug": "full-stack-todo-app", "category": "full-stack", "published": True},
        {"name": "Digital Library System", "slug": "digital-library-system", "published": True},
        {"name": "Epic Full-Stack E-commerce App", "slug": "epic-full-stack-e-commerce-app", "category": "full-stack", "published": True},
    ]
    for project in projects:
        Project.objects.get_or_create(slug=project["slug"], defaults=project)

    Profile.objects.get_or_create(
        name="Ziaullah Saafir",
        defaults={
            "headline": "Building Practical Solutions Through Code.",
            "introduction": "I'm a developer and computer science student who enjoys turning ideas into useful software. I build with the web, keep learning, and care about how things work behind the interface.",
            "about": "I'm studying Computer Science at FAST University, Peshawar Campus. My journey spans frontend interfaces, backend systems, and the ideas that connect them. I enjoy learning by building practical projects and improving them one step at a time. Looking ahead, I'm especially interested in deepening my understanding of AI and software engineering as I grow as a developer.",
            "education": "BS Computer Science · FAST University, Peshawar Campus",
            "interests": ["Software Engineering", "System Design", "Artificial Intelligence", "Machine Learning"],
            "github_url": "https://github.com/ZiaSaafir",
            "linkedin_url": "https://www.linkedin.com/in/zia-saafir-7b8562355/",
        },
    )
    skills = {
        "languages": ["Python", "JavaScript", "C++"],
        "frontend": ["React", "HTML", "CSS"],
        "backend": ["Django", "Django REST Framework", "REST APIs"],
        "databases": ["MySQL", "SQLite"],
        "ai-ml": ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI"],
        "tools": ["Git & GitHub"],
    }
    for group, names in skills.items():
        for order, name in enumerate(names):
            Skill.objects.get_or_create(name=name, group=group, defaults={"sort_order": order})


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Article",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("description", models.CharField(blank=True, max_length=320)),
                ("kind", models.CharField(choices=[("original", "My Article"), ("external", "External Publication")], default="original", max_length=12)),
                ("platform", models.CharField(blank=True, max_length=80)),
                ("content", models.TextField(blank=True, help_text="Markdown supported for original articles.")),
                ("cover_image", models.ImageField(blank=True, upload_to="articles/")),
                ("category", models.CharField(blank=True, max_length=80)),
                ("tags", models.JSONField(blank=True, default=list)),
                ("original_url", models.URLField(blank=True, validators=[django.core.validators.URLValidator()])),
                ("published_at", models.DateField(blank=True, null=True)),
                ("published", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-published_at", "-created_at"]},
        ),
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(max_length=180)),
                ("message", models.TextField(max_length=5000)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("email_sent", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(default="Ziaullah Saafir", max_length=120)),
                ("headline", models.CharField(default="Building Practical Solutions Through Code.", max_length=180)),
                ("introduction", models.TextField(blank=True)),
                ("about", models.TextField(blank=True)),
                ("education", models.CharField(default="BS Computer Science · FAST University, Peshawar Campus", max_length=180)),
                ("interests", models.JSONField(blank=True, default=list)),
                ("avatar", models.ImageField(blank=True, upload_to="profile/")),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("github_url", models.URLField(blank=True)),
                ("linkedin_url", models.URLField(blank=True)),
                ("cv", models.FileField(blank=True, upload_to="documents/")),
                ("availability_label", models.CharField(blank=True, max_length=80)),
                ("availability_enabled", models.BooleanField(default=False)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=140)),
                ("slug", models.SlugField(blank=True, max_length=160, unique=True)),
                ("description", models.TextField(blank=True)),
                ("category", models.CharField(choices=[("full-stack", "Full-Stack"), ("backend", "Backend"), ("frontend", "Frontend"), ("ai-ml", "AI / ML"), ("other", "Other")], default="other", max_length=20)),
                ("technologies", models.JSONField(blank=True, default=list)),
                ("image", models.ImageField(blank=True, upload_to="projects/")),
                ("github_url", models.URLField(blank=True, validators=[django.core.validators.URLValidator()])),
                ("demo_url", models.URLField(blank=True, validators=[django.core.validators.URLValidator()])),
                ("featured", models.BooleanField(default=False)),
                ("published", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-featured", "-updated_at", "name"]},
        ),
        migrations.CreateModel(
            name="Skill",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=80)),
                ("group", models.CharField(choices=[("languages", "Programming Languages"), ("frontend", "Frontend Development"), ("backend", "Backend Development"), ("databases", "Databases"), ("ai-ml", "AI & Machine Learning"), ("tools", "Development Tools")], max_length=20)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={"ordering": ["group", "sort_order", "name"], "unique_together": {("name", "group")}},
        ),
        migrations.RunPython(add_initial_projects, migrations.RunPython.noop),
    ]
