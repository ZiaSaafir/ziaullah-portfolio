from django.contrib import admin

from .models import Article, ContactMessage, Profile, Project, Skill


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "featured", "published", "updated_at")
    list_filter = ("category", "featured", "published")
    search_fields = ("name", "description", "technologies")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "platform", "published", "published_at")
    list_filter = ("kind", "platform", "published", "category")
    search_fields = ("title", "description", "content", "tags")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "headline", "updated_at")

    def has_add_permission(self, request):
        return not Profile.objects.exists() and super().has_add_permission(request)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "sort_order")
    list_filter = ("group",)
    search_fields = ("name",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "created_at", "email_sent")
    list_filter = ("email_sent", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "subject", "message", "created_at", "email_sent")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
