"""Serializers for the Frango Math API."""

from rest_framework import serializers
from .models import (
    MathModule,
    Question,
    UserProfile,
    QuizResult,
    ModuleProgress,
    Badge,
    UserBadge,
)


class MathModuleSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = MathModule
        fields = [
            'id', 'title', 'slug', 'description', 'icon',
            'color', 'lesson_count', 'order', 'question_count',
        ]

    def get_question_count(self, obj):
        return obj.questions.count()


class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'module', 'difficulty', 'text', 'options',
            'correct_option', 'explanation',
        ]

    def get_options(self, obj):
        return [obj.option_a, obj.option_b, obj.option_c, obj.option_d]


class QuestionListSerializer(serializers.ModelSerializer):
    """Serializer for quiz mode - hides the correct answer."""

    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'difficulty', 'text', 'options']

    def get_options(self, obj):
        return [obj.option_a, obj.option_b, obj.option_c, obj.option_d]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    next_level_xp = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'display_name', 'level', 'xp',
            'next_level_xp', 'streak_days', 'last_active_date',
        ]


class QuizResultSerializer(serializers.ModelSerializer):
    accuracy = serializers.ReadOnlyField()

    class Meta:
        model = QuizResult
        fields = [
            'id', 'topic', 'difficulty', 'score', 'correct_count',
            'total_questions', 'accuracy', 'time_taken_seconds',
            'completed_at',
        ]


class QuizResultCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = [
            'topic', 'difficulty', 'score', 'correct_count',
            'total_questions', 'time_taken_seconds',
        ]


class ModuleProgressSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_slug = serializers.CharField(source='module.slug', read_only=True)

    class Meta:
        model = ModuleProgress
        fields = [
            'id', 'module', 'module_title', 'module_slug',
            'progress_percent', 'lessons_completed', 'last_accessed',
        ]


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'criteria', 'xp_reward']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']


class LeaderboardSerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    display_name = serializers.CharField()
    level = serializers.IntegerField()
    xp = serializers.IntegerField()


class StatsSerializer(serializers.Serializer):
    quizzes_completed = serializers.IntegerField()
    average_accuracy = serializers.FloatField()
    total_xp = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    badges_earned = serializers.IntegerField()
    time_practiced_minutes = serializers.IntegerField()
