"""Models for the Frango Math Tutoring API."""

from django.db import models
from django.contrib.auth.models import User


class MathModule(models.Model):
    """A math topic module (e.g., Arithmetic, Algebra)."""

    COLORS = [
        ('purple', 'Purple'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('orange', 'Orange'),
        ('red', 'Red'),
        ('cyan', 'Cyan'),
    ]

    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=20, help_text='HTML entity for the icon')
    color = models.CharField(max_length=20, choices=COLORS, default='purple')
    lesson_count = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Question(models.Model):
    """A quiz question belonging to a module."""

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    module = models.ForeignKey(
        MathModule,
        on_delete=models.CASCADE,
        related_name='questions',
    )
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    text = models.TextField(help_text='The question text')
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    option_d = models.CharField(max_length=200)
    correct_option = models.PositiveSmallIntegerField(
        help_text='0=A, 1=B, 2=C, 3=D'
    )
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['module', 'difficulty', 'id']

    def __str__(self):
        return f"[{self.module.slug}/{self.difficulty}] {self.text[:60]}"


class UserProfile(models.Model):
    """Extended user profile with gamification data."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=50, default='Math Explorer')
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)
    streak_days = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} (Level {self.level})"

    @property
    def next_level_xp(self):
        """XP required for the next level."""
        return int(500 * (1.5 ** (self.level - 1)))


class QuizResult(models.Model):
    """Records the result of a completed quiz."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_results',
        null=True,
        blank=True,
    )
    module = models.ForeignKey(
        MathModule,
        on_delete=models.CASCADE,
        related_name='results',
        null=True,
        blank=True,
    )
    topic = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=10)
    score = models.PositiveIntegerField(default=0)
    correct_count = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    time_taken_seconds = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.topic} ({self.difficulty}) - {self.correct_count}/{self.total_questions}"

    @property
    def accuracy(self):
        if self.total_questions == 0:
            return 0
        return round((self.correct_count / self.total_questions) * 100, 1)


class ModuleProgress(models.Model):
    """Tracks a user's progress through a module."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='module_progress',
    )
    module = models.ForeignKey(
        MathModule,
        on_delete=models.CASCADE,
        related_name='user_progress',
    )
    progress_percent = models.FloatField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'module']
        ordering = ['-last_accessed']

    def __str__(self):
        return f"{self.user.username} - {self.module.title}: {self.progress_percent}%"


class Badge(models.Model):
    """An achievement badge that users can earn."""

    name = models.CharField(max_length=50)
    description = models.TextField()
    icon = models.CharField(max_length=20, help_text='HTML entity for the badge icon')
    criteria = models.TextField(help_text='Description of how to earn this badge')
    xp_reward = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """Records which badges a user has earned."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='earners')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge']
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"
