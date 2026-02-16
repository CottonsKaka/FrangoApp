# Frango - Self-Tutoring Math App

A gamified, interactive math tutoring platform with engaging quizzes, visual simulations, and progress tracking.

## Features

- **Dashboard** - Overview of stats, streaks, leaderboard, and daily challenges
- **Math Modules** - Arithmetic, Algebra, Geometry, Fractions, Statistics, Pre-Calculus
- **Quiz Arena** - Timed quizzes with 3 difficulty levels and instant feedback
- **Interactive Simulations** - Function grapher, geometry lab, probability simulator
- **Progress Tracking** - XP system, levels, badges, and topic mastery bars
- **Gamification** - Streaks, leaderboard, achievements, and XP rewards

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Backend | Python, Django, Django REST Framework |
| AI/ML | TensorFlow (adaptive difficulty - planned) |
| Database | SQLite (dev) / PostgreSQL (prod) |

## Project Structure

```
FrangoApp/
├── frontend/
│   ├── index.html          # Main app shell (SPA-style)
│   ├── style.css           # Complete styling (dark theme)
│   └── script.js           # App logic, quiz engine, simulations
├── backend/
│   ├── manage.py           # Django management
│   ├── frango/             # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/                # REST API app
│       ├── models.py       # MathModule, Question, QuizResult, Badge, etc.
│       ├── serializers.py  # DRF serializers
│       ├── views.py        # ViewSets and API views
│       ├── urls.py         # API routing
│       ├── admin.py        # Django admin config
│       └── management/commands/seed_data.py
├── requirements.txt        # Python dependencies
├── package.json            # Node config (for live-server)
└── README.md
```

## Quick Start

### Frontend Only (no backend needed)

The frontend works standalone with a built-in question bank:

```bash
# Option 1: Use live-server via npm
npx live-server frontend --port=3000

# Option 2: Open directly in browser
open frontend/index.html
```

### Full Stack (Frontend + Backend)

#### 1. Set up the backend

```bash
# Create a virtual environment
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
cd backend
python manage.py migrate

# Seed the database with modules, questions, and badges
python manage.py seed_data

# Create a superuser (optional, for admin panel)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

#### 2. Start the frontend

```bash
# From the project root
npx live-server frontend --port=3000
```

The app will automatically connect to the backend if available.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API root with all endpoints |
| GET | `/api/modules/` | List all math modules |
| GET | `/api/modules/{slug}/` | Module detail |
| GET | `/api/modules/{slug}/questions/` | Get quiz questions for a module |
| GET | `/api/questions/` | List all questions |
| POST | `/api/questions/{id}/check/` | Check an answer |
| GET/POST | `/api/quiz-results/` | List/create quiz results |
| GET | `/api/badges/` | List all badges |
| GET | `/api/stats/` | Dashboard statistics |
| GET | `/api/leaderboard/` | XP leaderboard |

## Django Admin

Access the admin panel at `http://localhost:8000/admin/` to manage modules, questions, badges, and user data.

## License

ISC
