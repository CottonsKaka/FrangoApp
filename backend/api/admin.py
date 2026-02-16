"""Admin configuration for the Frango Math API."""

from django.contrib import admin
from .models import (
    MathModule,
    Question,
    UserProfile,
    QuizResult,
    ModuleProgress,
    Badge,
    UserBadge,
)


@admin.register(MathModule)
class MathModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'color', 'lesson_count', 'order']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['order']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text_preview', 'module', 'difficulty', 'correct_option']
    list_filter = ['module', 'difficulty']
    search_fields = ['text']

    def text_preview(self, obj):
        return obj.text[:80]
    text_preview.short_description = 'Question'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user', 'level', 'xp', 'streak_days']
    list_filter = ['level']


@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ['topic', 'difficulty', 'score', 'correct_count', 'total_questions', 'completed_at']
    list_filter = ['topic', 'difficulty']


@admin.register(ModuleProgress)
class ModuleProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'module', 'progress_percent', 'lessons_completed']
    list_filter = ['module']


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'xp_reward']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'earned_at']
    list_filter = ['badge']
