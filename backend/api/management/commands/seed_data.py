"""Management command to seed the database with initial math modules and questions."""

from django.core.management.base import BaseCommand
from api.models import MathModule, Question, Badge


class Command(BaseCommand):
    help = 'Seeds the database with math modules, questions, and badges'

    def handle(self, *args, **options):
        self.stdout.write('Seeding math modules...')
        self._seed_modules()
        self.stdout.write('Seeding questions...')
        self._seed_questions()
        self.stdout.write('Seeding badges...')
        self._seed_badges()
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

    def _seed_modules(self):
        modules = [
            {'title': 'Arithmetic', 'slug': 'arithmetic', 'description': 'Master addition, subtraction, multiplication, and division.', 'icon': '&#10133;', 'color': 'purple', 'lesson_count': 12, 'order': 1},
            {'title': 'Algebra', 'slug': 'algebra', 'description': 'Solve equations, work with variables, and understand functions.', 'icon': '&#120;', 'color': 'blue', 'lesson_count': 15, 'order': 2},
            {'title': 'Geometry', 'slug': 'geometry', 'description': 'Explore shapes, angles, area, and volume calculations.', 'icon': '&#9651;', 'color': 'green', 'lesson_count': 10, 'order': 3},
            {'title': 'Fractions & Decimals', 'slug': 'fractions', 'description': 'Convert, add, subtract, multiply, and divide fractions.', 'icon': '&#189;', 'color': 'orange', 'lesson_count': 8, 'order': 4},
            {'title': 'Statistics', 'slug': 'statistics', 'description': 'Mean, median, mode, probability, and data analysis.', 'icon': '&#128202;', 'color': 'red', 'lesson_count': 9, 'order': 5},
            {'title': 'Pre-Calculus', 'slug': 'calculus', 'description': 'Limits, sequences, trigonometry, and introductory calculus.', 'icon': '&#8747;', 'color': 'cyan', 'lesson_count': 14, 'order': 6},
        ]
        for m in modules:
            MathModule.objects.update_or_create(slug=m['slug'], defaults=m)

    def _seed_questions(self):
        questions_data = {
            'arithmetic': {
                'easy': [
                    ('What is 15 + 27?', '42', '41', '43', '40', 0, '15 + 27 = 42'),
                    ('What is 8 x 7?', '54', '56', '58', '48', 1, '8 x 7 = 56'),
                    ('What is 100 - 37?', '73', '63', '67', '57', 1, '100 - 37 = 63'),
                    ('What is 144 / 12?', '11', '14', '12', '13', 2, '144 / 12 = 12'),
                    ('What is 25 x 4?', '100', '90', '110', '80', 0, '25 x 4 = 100'),
                ],
                'medium': [
                    ('What is 347 + 589?', '936', '926', '946', '916', 0, '347 + 589 = 936'),
                    ('What is 23 x 17?', '381', '391', '401', '371', 1, '23 x 17 = 391'),
                    ('What is 1000 - 467?', '533', '543', '523', '553', 0, '1000 - 467 = 533'),
                ],
                'hard': [
                    ('What is 2^10?', '512', '1024', '2048', '256', 1, '2^10 = 1024'),
                    ('What is the GCD of 48 and 36?', '6', '12', '18', '24', 1, 'GCD(48, 36) = 12'),
                    ('What is the LCM of 12 and 18?', '36', '72', '24', '48', 0, 'LCM(12, 18) = 36'),
                ],
            },
            'algebra': {
                'easy': [
                    ('Solve: x + 5 = 12', '5', '6', '7', '8', 2, 'x = 12 - 5 = 7'),
                    ('Solve: 3x = 21', '6', '7', '8', '9', 1, 'x = 21 / 3 = 7'),
                    ('If y = 2x + 1, what is y when x = 3?', '5', '6', '7', '8', 2, 'y = 2(3) + 1 = 7'),
                ],
                'medium': [
                    ('Solve: 2x + 5 = 3x - 7', '12', '10', '14', '-2', 0, '5 + 7 = 3x - 2x, so x = 12'),
                    ('Factor: x² - 9', '(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+3)²', 0, 'Difference of squares'),
                ],
                'hard': [
                    ('Solve: x² - 5x + 6 = 0', 'x=2,3', 'x=-2,-3', 'x=1,6', 'x=-1,-6', 0, '(x-2)(x-3)=0'),
                    ('Solve: log₂(x) = 5', '10', '25', '32', '64', 2, 'x = 2⁵ = 32'),
                ],
            },
        }

        for module_slug, difficulties in questions_data.items():
            try:
                module = MathModule.objects.get(slug=module_slug)
            except MathModule.DoesNotExist:
                continue

            for difficulty, questions in difficulties.items():
                for q_data in questions:
                    text, a, b, c, d, correct, explanation = q_data
                    Question.objects.update_or_create(
                        module=module,
                        text=text,
                        defaults={
                            'difficulty': difficulty,
                            'option_a': a,
                            'option_b': b,
                            'option_c': c,
                            'option_d': d,
                            'correct_option': correct,
                            'explanation': explanation,
                        },
                    )

    def _seed_badges(self):
        badges = [
            {'name': 'First Steps', 'description': 'Complete your first quiz', 'icon': '&#127942;', 'criteria': 'Complete 1 quiz', 'xp_reward': 50},
            {'name': 'Streak Master', 'description': 'Practice 7 days in a row', 'icon': '&#128293;', 'criteria': '7-day streak', 'xp_reward': 100},
            {'name': 'Sharpshooter', 'description': 'Get 100% accuracy on a quiz', 'icon': '&#127919;', 'criteria': '100% accuracy', 'xp_reward': 75},
            {'name': 'XP Hunter', 'description': 'Earn 1,000 XP', 'icon': '&#11088;', 'criteria': 'Accumulate 1000 XP', 'xp_reward': 50},
            {'name': 'Speed Demon', 'description': 'Complete a quiz in under 60 seconds', 'icon': '&#9889;', 'criteria': 'Quiz < 60s', 'xp_reward': 75},
            {'name': 'Bookworm', 'description': 'Complete 10 quizzes', 'icon': '&#128218;', 'criteria': '10 quizzes completed', 'xp_reward': 100},
            {'name': 'Scholar', 'description': 'Complete 20 quizzes', 'icon': '&#127775;', 'criteria': '20 quizzes completed', 'xp_reward': 150},
            {'name': 'Brave', 'description': 'Complete a Hard difficulty quiz', 'icon': '&#128170;', 'criteria': 'Complete 1 hard quiz', 'xp_reward': 50},
            {'name': 'Champion', 'description': 'Reach Top 3 on the leaderboard', 'icon': '&#129351;', 'criteria': 'Top 3 leaderboard', 'xp_reward': 200},
            {'name': 'Legend', 'description': 'Earn 5,000 XP', 'icon': '&#128640;', 'criteria': 'Accumulate 5000 XP', 'xp_reward': 100},
            {'name': 'Dedicated', 'description': 'Complete 50 quizzes', 'icon': '&#127881;', 'criteria': '50 quizzes completed', 'xp_reward': 250},
            {'name': 'Math Master', 'description': 'Achieve 100% mastery in any module', 'icon': '&#128081;', 'criteria': '100% module mastery', 'xp_reward': 500},
        ]
        for b in badges:
            Badge.objects.update_or_create(name=b['name'], defaults=b)
