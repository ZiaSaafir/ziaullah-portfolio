from django.urls import path

from .views import (
    AdminArticleDetail,
    AdminArticleList,
    AdminProjectDetail,
    AdminProjectList,
    ContactSubmission,
    PublicArticleDetail,
    PublicArticleList,
    PublicProfile,
    PublicProjectList,
    PublicSkillList,
)

urlpatterns = [
    path("projects/", PublicProjectList.as_view(), name="projects"),
    path("articles/", PublicArticleList.as_view(), name="articles"),
    path("articles/<slug:slug>/", PublicArticleDetail.as_view(), name="article-detail"),
    path("profile/", PublicProfile.as_view(), name="profile"),
    path("skills/", PublicSkillList.as_view(), name="skills"),
    path("contact/", ContactSubmission.as_view(), name="contact"),
    path("manage/projects/", AdminProjectList.as_view(), name="manage-projects"),
    path("manage/projects/<int:pk>/", AdminProjectDetail.as_view(), name="manage-project"),
    path("manage/articles/", AdminArticleList.as_view(), name="manage-articles"),
    path("manage/articles/<int:pk>/", AdminArticleDetail.as_view(), name="manage-article"),
]
