"""Views for the Frango Math API."""

from django.db.models import Avg
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from .models import (
    MathModule,
    Question,
    UserProfile,
    QuizResult,
    ModuleProgress,
    Badge,
    UserBadge,
)
from .serializers import (
    MathModuleSerializer,
    QuestionSerializer,
    QuestionListSerializer,
    UserProfileSerializer,
    QuizResultSerializer,
    QuizResultCreateSerializer,
    ModuleProgressSerializer,
    BadgeSerializer,
    UserBadgeSerializer,
)


class MathModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for math modules."""

    queryset = MathModule.objects.all()
    serializer_class = MathModuleSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def questions(self, request, slug=None):
        """Get questions for a specific module, optionally filtered by difficulty."""
        module = self.get_object()
        difficulty = request.query_params.get('difficulty')
        limit = request.query_params.get('limit', 10)

        questions = module.questions.all()
        if difficulty:
            questions = questions.filter(difficulty=difficulty)

        questions = questions.order_by('?')[:int(limit)]
        serializer = QuestionListSerializer(questions, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for questions."""

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = Question.objects.all()
        module_slug = self.request.query_params.get('module')
        difficulty = self.request.query_params.get('difficulty')

        if module_slug:
            queryset = queryset.filter(module__slug=module_slug)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        return queryset

    @action(detail=True, methods=['post'])
    def check(self, request, pk=None):
        """Check if an answer is correct."""
        question = self.get_object()
        selected = request.data.get('selected')

        if selected is None:
            return Response(
                {'error': 'Please provide a selected option (0-3)'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_correct = int(selected) == question.correct_option
        return Response({
            'correct': is_correct,
            'correct_option': question.correct_option,
            'explanation': question.explanation,
        })


class QuizResultViewSet(viewsets.ModelViewSet):
    """API endpoint for quiz results."""

    queryset = QuizResult.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return QuizResultCreateSerializer
        return QuizResultSerializer

    def get_queryset(self):
        queryset = QuizResult.objects.all()
        topic = self.request.query_params.get('topic')
        difficulty = self.request.query_params.get('difficulty')

        if topic:
            queryset = queryset.filter(topic=topic)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        return queryset


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for badges."""

    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer


@api_view(['GET'])
def api_root(request):
    """API root with available endpoints."""
    return Response({
        'app': 'Frango - Self-Tutoring Math App',
        'version': '1.0.0',
        'endpoints': {
            'modules': '/api/modules/',
            'questions': '/api/questions/',
            'quiz-results': '/api/quiz-results/',
            'badges': '/api/badges/',
            'stats': '/api/stats/',
            'leaderboard': '/api/leaderboard/',
        },
    })


@api_view(['GET'])
def stats_view(request):
    """Get aggregated stats for the dashboard."""
    results = QuizResult.objects.all()

    total_quizzes = results.count()
    avg_accuracy = 0
    if total_quizzes > 0:
        accuracies = [r.accuracy for r in results]
        avg_accuracy = sum(accuracies) / len(accuracies)

    total_time = sum(r.time_taken_seconds for r in results)

    return Response({
        'quizzes_completed': total_quizzes,
        'average_accuracy': round(avg_accuracy, 1),
        'total_xp': sum(r.score for r in results),
        'current_streak': 0,
        'badges_earned': UserBadge.objects.count(),
        'time_practiced_minutes': total_time // 60,
    })


@api_view(['GET'])
def leaderboard_view(request):
    """Get the XP leaderboard."""
    profiles = UserProfile.objects.order_by('-xp')[:10]
    data = []
    for rank, profile in enumerate(profiles, 1):
        data.append({
            'rank': rank,
            'display_name': profile.display_name,
            'level': profile.level,
            'xp': profile.xp,
        })
    return Response(data)
