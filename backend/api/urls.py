"""URL configuration for the Frango API."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'modules', views.MathModuleViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'quiz-results', views.QuizResultViewSet)
router.register(r'badges', views.BadgeViewSet)

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('', include(router.urls)),
    path('stats/', views.stats_view, name='stats'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
]
