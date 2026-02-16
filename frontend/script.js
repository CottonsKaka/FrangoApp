/* ============================================
   FRANGO - Self-Tutoring Math App
   Main Application Logic
   ============================================ */

// ---- API Configuration ----
const API_BASE = 'http://localhost:8000/api';

// ---- Application State ----
const state = {
    currentPage: 'dashboard',
    user: {
        name: 'Math Explorer',
        level: 5,
        xp: 1250,
        nextLevelXP: 2000,
        streak: 7,
        quizzesCompleted: 24,
        accuracy: 87,
        timeSpent: '12h',
        badgesEarned: 8,
    },
    quiz: {
        active: false,
        difficulty: 'easy',
        topic: 'arithmetic',
        questions: [],
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        timer: 30,
        timerInterval: null,
        startTime: null,
    },
    modules: [
        {
            id: 'arithmetic',
            title: 'Arithmetic',
            desc: 'Master addition, subtraction, multiplication, and division.',
            icon: '&#10133;',
            color: 'purple',
            lessons: 12,
            progress: 75,
        },
        {
            id: 'algebra',
            title: 'Algebra',
            desc: 'Solve equations, work with variables, and understand functions.',
            icon: '&#120;',
            color: 'blue',
            lessons: 15,
            progress: 45,
        },
        {
            id: 'geometry',
            title: 'Geometry',
            desc: 'Explore shapes, angles, area, and volume calculations.',
            icon: '&#9651;',
            color: 'green',
            lessons: 10,
            progress: 60,
        },
        {
            id: 'fractions',
            title: 'Fractions & Decimals',
            desc: 'Convert, add, subtract, multiply, and divide fractions.',
            icon: '&#189;',
            color: 'orange',
            lessons: 8,
            progress: 30,
        },
        {
            id: 'statistics',
            title: 'Statistics',
            desc: 'Mean, median, mode, probability, and data analysis.',
            icon: '&#128202;',
            color: 'red',
            lessons: 9,
            progress: 20,
        },
        {
            id: 'calculus',
            title: 'Pre-Calculus',
            desc: 'Limits, sequences, trigonometry, and introductory calculus.',
            icon: '&#8747;',
            color: 'cyan',
            lessons: 14,
            progress: 10,
        },
    ],
    leaderboard: [
        { name: 'AlgebraAce', initials: 'AA', xp: 3200 },
        { name: 'MathWizard', initials: 'MW', xp: 2800 },
        { name: 'NumberNinja', initials: 'NN', xp: 2100 },
        { name: 'You', initials: 'M', xp: 1250 },
        { name: 'CalcKing', initials: 'CK', xp: 980 },
    ],
    achievements: [
        { icon: '&#127942;', name: 'First Quiz', desc: 'Completed your first quiz' },
        { icon: '&#128293;', name: '7-Day Streak', desc: 'Practiced 7 days in a row' },
        { icon: '&#127919;', name: 'Sharpshooter', desc: '100% accuracy on a quiz' },
    ],
    badges: [
        { icon: '&#127942;', name: 'Starter', unlocked: true },
        { icon: '&#128293;', name: 'Streak 7', unlocked: true },
        { icon: '&#127919;', name: 'Accurate', unlocked: true },
        { icon: '&#11088;', name: '1000 XP', unlocked: true },
        { icon: '&#9889;', name: 'Speed', unlocked: true },
        { icon: '&#128218;', name: '10 Quizzes', unlocked: true },
        { icon: '&#127775;', name: '20 Quizzes', unlocked: true },
        { icon: '&#128170;', name: 'Hard Mode', unlocked: true },
        { icon: '&#129351;', name: 'Top 3', unlocked: false },
        { icon: '&#128640;', name: '5000 XP', unlocked: false },
        { icon: '&#127881;', name: '50 Quizzes', unlocked: false },
        { icon: '&#128081;', name: 'Master', unlocked: false },
    ],
};

// ---- Question Bank ----
const questionBank = {
    arithmetic: {
        easy: [
            { q: 'What is 15 + 27?', options: ['42', '41', '43', '40'], answer: 0, explanation: '15 + 27 = 42' },
            { q: 'What is 8 x 7?', options: ['54', '56', '58', '48'], answer: 1, explanation: '8 x 7 = 56' },
            { q: 'What is 100 - 37?', options: ['73', '63', '67', '57'], answer: 1, explanation: '100 - 37 = 63' },
            { q: 'What is 144 / 12?', options: ['11', '14', '12', '13'], answer: 2, explanation: '144 / 12 = 12' },
            { q: 'What is 25 x 4?', options: ['100', '90', '110', '80'], answer: 0, explanation: '25 x 4 = 100' },
        ],
        medium: [
            { q: 'What is 347 + 589?', options: ['936', '926', '946', '916'], answer: 0, explanation: '347 + 589 = 936' },
            { q: 'What is 23 x 17?', options: ['381', '391', '401', '371'], answer: 1, explanation: '23 x 17 = 391' },
            { q: 'What is 1000 - 467?', options: ['533', '543', '523', '553'], answer: 0, explanation: '1000 - 467 = 533' },
            { q: 'What is 756 / 9?', options: ['82', '84', '86', '88'], answer: 1, explanation: '756 / 9 = 84' },
            { q: 'What is 15 squared?', options: ['215', '225', '235', '245'], answer: 1, explanation: '15² = 225' },
        ],
        hard: [
            { q: 'What is 2^10?', options: ['512', '1024', '2048', '256'], answer: 1, explanation: '2^10 = 1024' },
            { q: 'What is the GCD of 48 and 36?', options: ['6', '12', '18', '24'], answer: 1, explanation: 'GCD(48, 36) = 12' },
            { q: 'What is 17! / 16!?', options: ['16', '17', '18', '1'], answer: 1, explanation: '17! / 16! = 17' },
            { q: 'What is (-3)^3?', options: ['27', '-27', '9', '-9'], answer: 1, explanation: '(-3)^3 = -27' },
            { q: 'What is the LCM of 12 and 18?', options: ['36', '72', '24', '48'], answer: 0, explanation: 'LCM(12, 18) = 36' },
        ],
    },
    algebra: {
        easy: [
            { q: 'Solve: x + 5 = 12', options: ['5', '6', '7', '8'], answer: 2, explanation: 'x = 12 - 5 = 7' },
            { q: 'Solve: 3x = 21', options: ['6', '7', '8', '9'], answer: 1, explanation: 'x = 21 / 3 = 7' },
            { q: 'If y = 2x + 1, what is y when x = 3?', options: ['5', '6', '7', '8'], answer: 2, explanation: 'y = 2(3) + 1 = 7' },
            { q: 'Simplify: 4x + 3x', options: ['7x', '12x', '7x²', '12'], answer: 0, explanation: '4x + 3x = 7x' },
            { q: 'Solve: x/4 = 8', options: ['24', '32', '16', '2'], answer: 1, explanation: 'x = 8 x 4 = 32' },
        ],
        medium: [
            { q: 'Solve: 2x + 5 = 3x - 7', options: ['12', '10', '14', '-2'], answer: 0, explanation: '5 + 7 = 3x - 2x, so x = 12' },
            { q: 'Factor: x² - 9', options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+3)²'], answer: 0, explanation: 'Difference of squares: x²-9 = (x-3)(x+3)' },
            { q: 'Solve: |x - 3| = 5', options: ['8 or -2', '8 or 2', '-8 or 2', '-8 or -2'], answer: 0, explanation: 'x - 3 = 5 or x - 3 = -5, so x = 8 or x = -2' },
            { q: 'What is the slope of y = -2x + 7?', options: ['7', '-2', '2', '-7'], answer: 1, explanation: 'In y = mx + b, slope m = -2' },
            { q: 'Expand: (x + 4)²', options: ['x² + 8x + 16', 'x² + 4x + 16', 'x² + 16', 'x² + 8x + 8'], answer: 0, explanation: '(x+4)² = x² + 2(4)x + 16 = x² + 8x + 16' },
        ],
        hard: [
            { q: 'Solve: x² - 5x + 6 = 0', options: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6', 'x = -1, -6'], answer: 0, explanation: '(x-2)(x-3)=0, so x=2 or x=3' },
            { q: 'What is the discriminant of 2x² + 3x - 5 = 0?', options: ['49', '31', '-31', '9'], answer: 0, explanation: 'D = b²-4ac = 9-4(2)(-5) = 9+40 = 49' },
            { q: 'Simplify: (x³ · x⁴) / x²', options: ['x⁵', 'x⁷', 'x⁹', 'x'], answer: 0, explanation: 'x^(3+4-2) = x⁵' },
            { q: 'If f(x) = x² - 4x + 3, what is f(5)?', options: ['8', '6', '10', '4'], answer: 0, explanation: 'f(5) = 25 - 20 + 3 = 8' },
            { q: 'Solve: log₂(x) = 5', options: ['10', '25', '32', '64'], answer: 2, explanation: 'x = 2⁵ = 32' },
        ],
    },
    geometry: {
        easy: [
            { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: 1, explanation: 'A hexagon has 6 sides.' },
            { q: 'What is the area of a rectangle with width 5 and height 8?', options: ['13', '26', '40', '45'], answer: 2, explanation: 'Area = 5 x 8 = 40' },
            { q: 'What is the perimeter of a square with side 9?', options: ['18', '27', '36', '81'], answer: 2, explanation: 'Perimeter = 4 x 9 = 36' },
            { q: 'Angles in a triangle sum to...', options: ['90°', '180°', '270°', '360°'], answer: 1, explanation: 'Triangle angles sum to 180°.' },
            { q: 'What is the circumference formula for a circle?', options: ['πr²', '2πr', 'πd²', '2πr²'], answer: 1, explanation: 'Circumference = 2πr' },
        ],
        medium: [
            { q: 'What is the area of a circle with radius 7? (use π ≈ 22/7)', options: ['154', '44', '88', '308'], answer: 0, explanation: 'A = πr² = (22/7)(49) = 154' },
            { q: 'Find the hypotenuse: legs are 3 and 4.', options: ['5', '6', '7', '8'], answer: 0, explanation: '√(9+16) = √25 = 5' },
            { q: 'Volume of a cube with side 5?', options: ['25', '75', '125', '150'], answer: 2, explanation: 'V = 5³ = 125' },
            { q: 'What is the area of a triangle with base 10 and height 6?', options: ['60', '30', '16', '36'], answer: 1, explanation: 'A = ½ × 10 × 6 = 30' },
            { q: 'Interior angle of a regular pentagon?', options: ['108°', '120°', '135°', '90°'], answer: 0, explanation: '(5-2)×180/5 = 108°' },
        ],
        hard: [
            { q: 'Surface area of a sphere with r=3?', options: ['36π', '108π', '27π', '12π'], answer: 0, explanation: 'SA = 4πr² = 4π(9) = 36π' },
            { q: 'What is the volume of a cone with r=3, h=4?', options: ['12π', '36π', '9π', '16π'], answer: 0, explanation: 'V = ⅓πr²h = ⅓π(9)(4) = 12π' },
            { q: 'Distance between (1,2) and (4,6)?', options: ['5', '6', '7', '√7'], answer: 0, explanation: 'd = √(9+16) = √25 = 5' },
            { q: 'Area of a trapezoid: bases 8 & 12, height 5?', options: ['50', '60', '40', '100'], answer: 0, explanation: 'A = ½(8+12)(5) = 50' },
            { q: 'What is the diagonal of a square with side 10?', options: ['10√2', '20', '10√3', '15'], answer: 0, explanation: 'd = s√2 = 10√2' },
        ],
    },
    fractions: {
        easy: [
            { q: 'What is 1/2 + 1/4?', options: ['3/4', '2/6', '1/6', '2/4'], answer: 0, explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4' },
            { q: 'Simplify: 6/8', options: ['3/4', '2/3', '1/2', '3/8'], answer: 0, explanation: '6/8 = 3/4' },
            { q: 'What is 0.75 as a fraction?', options: ['3/4', '7/5', '3/5', '7/10'], answer: 0, explanation: '0.75 = 75/100 = 3/4' },
            { q: 'What is 2/3 of 12?', options: ['6', '8', '9', '4'], answer: 1, explanation: '(2/3) × 12 = 8' },
            { q: 'Convert 5/4 to a mixed number.', options: ['1¼', '1½', '1¾', '2¼'], answer: 0, explanation: '5/4 = 1 remainder 1 = 1¼' },
        ],
        medium: [
            { q: 'What is 2/3 + 3/5?', options: ['19/15', '5/8', '1/3', '13/15'], answer: 0, explanation: '10/15 + 9/15 = 19/15' },
            { q: 'What is 7/8 - 1/3?', options: ['13/24', '6/5', '1/2', '5/24'], answer: 0, explanation: '21/24 - 8/24 = 13/24' },
            { q: 'What is 3/4 x 2/5?', options: ['3/10', '5/9', '6/20', '1/2'], answer: 0, explanation: '(3x2)/(4x5) = 6/20 = 3/10' },
            { q: 'What is 5/6 ÷ 2/3?', options: ['5/4', '10/18', '5/9', '3/4'], answer: 0, explanation: '5/6 × 3/2 = 15/12 = 5/4' },
            { q: 'What is 0.125 as a fraction?', options: ['1/8', '1/4', '1/6', '1/10'], answer: 0, explanation: '0.125 = 125/1000 = 1/8' },
        ],
        hard: [
            { q: 'Simplify: (2/3)³', options: ['8/27', '6/9', '2/9', '4/27'], answer: 0, explanation: '(2/3)³ = 8/27' },
            { q: 'What is 1/(1/2 + 1/3)?', options: ['6/5', '5/6', '5', '1'], answer: 0, explanation: '1/(3/6 + 2/6) = 1/(5/6) = 6/5' },
            { q: 'Express 0.̄3̄ as a fraction.', options: ['1/3', '3/10', '33/100', '3/9'], answer: 0, explanation: '0.333... = 1/3' },
            { q: 'What is √(9/16)?', options: ['3/4', '9/16', '3/8', '9/4'], answer: 0, explanation: '√(9/16) = √9/√16 = 3/4' },
            { q: 'Solve: x/3 + x/4 = 7', options: ['12', '7', '21', '84/7'], answer: 0, explanation: '(4x+3x)/12 = 7 → 7x = 84 → x = 12' },
        ],
    },
    statistics: {
        easy: [
            { q: 'What is the mean of 2, 4, 6, 8, 10?', options: ['5', '6', '7', '8'], answer: 1, explanation: 'Mean = 30/5 = 6' },
            { q: 'What is the median of 3, 1, 4, 1, 5?', options: ['1', '3', '4', '5'], answer: 1, explanation: 'Sorted: 1,1,3,4,5 → median = 3' },
            { q: 'What is the mode of 1, 2, 2, 3, 4?', options: ['1', '2', '3', '4'], answer: 1, explanation: '2 appears most often.' },
            { q: 'What is the range of 5, 12, 3, 9, 1?', options: ['9', '10', '11', '12'], answer: 2, explanation: 'Range = 12 - 1 = 11' },
            { q: 'Probability of heads on a fair coin?', options: ['1/4', '1/3', '1/2', '1'], answer: 2, explanation: 'P(heads) = 1/2' },
        ],
        medium: [
            { q: 'What is the variance of {2, 4, 6}? (population)', options: ['8/3', '2', '4', '2/3'], answer: 0, explanation: 'Mean=4, var = ((4+0+4)/3) = 8/3' },
            { q: 'In a standard deck, P(drawing a heart)?', options: ['1/2', '1/3', '1/4', '1/13'], answer: 2, explanation: '13 hearts out of 52 = 1/4' },
            { q: 'If P(A) = 0.3, what is P(not A)?', options: ['0.3', '0.5', '0.7', '1.3'], answer: 2, explanation: "P(A') = 1 - P(A) = 0.7" },
            { q: 'Standard deviation is the __ of variance.', options: ['Square root', 'Square', 'Inverse', 'Log'], answer: 0, explanation: 'SD = √variance' },
            { q: 'How many outcomes rolling 2 dice?', options: ['12', '24', '36', '6'], answer: 2, explanation: '6 x 6 = 36 outcomes' },
        ],
        hard: [
            { q: 'In a normal distribution, ~68% of data falls within how many SDs?', options: ['1', '2', '3', '0.5'], answer: 0, explanation: '68-95-99.7 rule: ~68% within 1 SD' },
            { q: 'Combination: C(10,3) = ?', options: ['120', '720', '30', '1000'], answer: 0, explanation: 'C(10,3) = 10!/(3!·7!) = 120' },
            { q: 'Permutation: P(5,2) = ?', options: ['10', '20', '25', '30'], answer: 1, explanation: 'P(5,2) = 5!/3! = 20' },
            { q: 'Bayes: If P(B|A)=0.8, P(A)=0.5, P(B)=0.6, what is P(A|B)?', options: ['2/3', '3/4', '1/2', '4/5'], answer: 0, explanation: 'P(A|B) = P(B|A)P(A)/P(B) = 0.4/0.6 = 2/3' },
            { q: 'Expected value of rolling a fair die?', options: ['3', '3.5', '4', '2.5'], answer: 1, explanation: 'E = (1+2+3+4+5+6)/6 = 3.5' },
        ],
    },
    calculus: {
        easy: [
            { q: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x³'], answer: 1, explanation: 'd/dx(x²) = 2x' },
            { q: 'What is the derivative of 5x?', options: ['5', '5x', 'x', '0'], answer: 0, explanation: 'd/dx(5x) = 5' },
            { q: 'What is the integral of 1 dx?', options: ['x + C', '1 + C', '0', 'C'], answer: 0, explanation: '∫1 dx = x + C' },
            { q: 'What does a derivative represent?', options: ['Area', 'Rate of change', 'Sum', 'Average'], answer: 1, explanation: 'A derivative is the rate of change.' },
            { q: "lim (x→2) of x² = ?", options: ['2', '4', '0', '∞'], answer: 1, explanation: 'Direct substitution: 2² = 4' },
        ],
        medium: [
            { q: 'Derivative of sin(x)?', options: ['cos(x)', '-sin(x)', '-cos(x)', 'tan(x)'], answer: 0, explanation: 'd/dx(sin x) = cos x' },
            { q: 'Integral of 2x dx?', options: ['x² + C', '2x² + C', 'x + C', '2 + C'], answer: 0, explanation: '∫2x dx = x² + C' },
            { q: 'Derivative of e^x?', options: ['xe^(x-1)', 'e^x', 'e^(x+1)', 'ln(x)'], answer: 1, explanation: 'd/dx(e^x) = e^x' },
            { q: 'What is lim (x→0) sin(x)/x?', options: ['0', '1', '∞', 'undefined'], answer: 1, explanation: 'Classic limit: lim sin(x)/x = 1' },
            { q: 'Derivative of ln(x)?', options: ['1/x', 'x', 'ln(x)/x', 'e^x'], answer: 0, explanation: 'd/dx(ln x) = 1/x' },
        ],
        hard: [
            { q: 'Derivative of x·sin(x)?', options: ['sin(x)+x·cos(x)', 'x·cos(x)', 'cos(x)', 'sin(x)·cos(x)'], answer: 0, explanation: 'Product rule: sin(x) + x·cos(x)' },
            { q: '∫₀¹ x² dx = ?', options: ['1/3', '1/2', '1', '2/3'], answer: 0, explanation: '[x³/3]₀¹ = 1/3' },
            { q: 'What is the second derivative of x³?', options: ['3x²', '6x', '6', '3x'], answer: 1, explanation: "f'=3x², f''=6x" },
            { q: 'Derivative of (3x+1)⁴ using chain rule?', options: ['12(3x+1)³', '4(3x+1)³', '3(3x+1)⁴', '12x³'], answer: 0, explanation: '4(3x+1)³ · 3 = 12(3x+1)³' },
            { q: '∫ 1/x dx = ?', options: ['ln|x| + C', 'x + C', '-1/x² + C', 'e^x + C'], answer: 0, explanation: '∫(1/x)dx = ln|x| + C' },
        ],
    },
};

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDashboard();
    initModules();
    initQuiz();
    initSimulations();
    initProgress();
    tryFetchFromBackend();
});

// ---- Try Backend Connection ----
async function tryFetchFromBackend() {
    try {
        const response = await fetch(`${API_BASE}/modules/`, { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                showToast('Connected to backend!', 'success');
            }
        }
    } catch {
        // Backend not available - running in standalone mode
        console.log('Running in standalone mode (no backend detected)');
    }
}

// ---- Navigation ----
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
            sidebar.classList.remove('open');
        });
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

function navigateTo(page) {
    state.currentPage = page;

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
}

// ---- Dashboard ----
function initDashboard() {
    renderContinueLearning();
    renderLeaderboard();
    renderAchievements();
    renderDailyChallenge();
}

function renderContinueLearning() {
    const container = document.getElementById('continueItems');
    const colors = { arithmetic: '#6C5CE7', algebra: '#0984E3', geometry: '#00B894', fractions: '#F39C12' };
    const icons = { arithmetic: '&#10133;', algebra: '&#120;', geometry: '&#9651;', fractions: '&#189;' };

    const topModules = state.modules.filter(m => m.progress > 0 && m.progress < 100).slice(0, 3);

    container.innerHTML = topModules.map(m => `
        <div class="continue-item">
            <div class="continue-icon" style="background: ${colors[m.id] || '#6C5CE7'}22; color: ${colors[m.id] || '#6C5CE7'}">
                ${icons[m.id] || '&#128218;'}
            </div>
            <div class="continue-info">
                <div class="continue-title">${m.title}</div>
                <div class="continue-progress">
                    <div class="continue-progress-fill" style="width: ${m.progress}%; background: ${colors[m.id] || '#6C5CE7'}"></div>
                </div>
            </div>
            <div class="continue-percent">${m.progress}%</div>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboardList');
    const rankClasses = ['gold', 'silver', 'bronze'];

    container.innerHTML = state.leaderboard.map((entry, i) => `
        <div class="leaderboard-item">
            <div class="lb-rank ${rankClasses[i] || ''}">${i + 1}</div>
            <div class="lb-avatar">${entry.initials}</div>
            <div class="lb-name">${entry.name}</div>
            <div class="lb-xp">${entry.xp.toLocaleString()} XP</div>
        </div>
    `).join('');
}

function renderAchievements() {
    const container = document.getElementById('achievementsList');
    container.innerHTML = state.achievements.map(a => `
        <div class="achievement-item">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
        </div>
    `).join('');
}

function renderDailyChallenge() {
    const container = document.getElementById('dailyChallenge');
    const challenge = {
        question: 'If a train travels at 60 mph for 2.5 hours, how far does it go?',
        options: ['120 miles', '150 miles', '130 miles', '160 miles'],
        answer: 1,
        reward: 50,
    };

    container.innerHTML = `
        <div class="daily-question">${challenge.question}</div>
        <div class="daily-options">
            ${challenge.options.map((opt, i) => `
                <button class="daily-option" data-index="${i}">${opt}</button>
            `).join('')}
        </div>
        <div class="daily-reward">&#11088; Reward: ${challenge.reward} XP</div>
    `;

    container.querySelectorAll('.daily-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            container.querySelectorAll('.daily-option').forEach(b => {
                b.disabled = true;
                if (parseInt(b.dataset.index) === challenge.answer) {
                    b.classList.add('correct');
                }
            });

            if (idx === challenge.answer) {
                btn.classList.add('correct');
                addXP(challenge.reward);
                showToast(`+${challenge.reward} XP! Correct!`, 'xp');
            } else {
                btn.classList.add('incorrect');
                showToast('Not quite! Try again tomorrow.', 'error');
            }
        });
    });
}

// ---- Modules ----
function initModules() {
    const grid = document.getElementById('modulesGrid');
    const circumference = 2 * Math.PI * 16;

    grid.innerHTML = state.modules.map(m => {
        const offset = circumference - (m.progress / 100) * circumference;
        return `
            <div class="module-card" data-color="${m.color}" onclick="navigateTo('quiz')">
                <div class="module-icon">${m.icon}</div>
                <div class="module-title">${m.title}</div>
                <div class="module-desc">${m.desc}</div>
                <div class="module-meta">
                    <span class="module-lessons">${m.lessons} lessons</span>
                    <div class="module-progress-ring">
                        <svg viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="16" class="module-ring-bg"/>
                            <circle cx="20" cy="20" r="16" class="module-ring-fill"
                                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}"
                                transform="rotate(-90 20 20)"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ---- Quiz ----
function initQuiz() {
    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.quiz.difficulty = btn.dataset.difficulty;
        });
    });

    // Topic options
    const topicContainer = document.getElementById('topicOptions');
    topicContainer.innerHTML = state.modules.map(m => `
        <button class="topic-btn ${m.id === 'arithmetic' ? 'active' : ''}" data-topic="${m.id}">${m.title}</button>
    `).join('');

    topicContainer.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            topicContainer.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.quiz.topic = btn.dataset.topic;
        });
    });

    // Start quiz
    document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('retryQuizBtn').addEventListener('click', startQuiz);
    document.getElementById('backToQuizzesBtn').addEventListener('click', resetQuizUI);
}

function startQuiz() {
    const { difficulty, topic } = state.quiz;
    const questions = questionBank[topic]?.[difficulty];

    if (!questions || questions.length === 0) {
        showToast('No questions available for this combination.', 'error');
        return;
    }

    state.quiz.questions = shuffleArray([...questions]).slice(0, 5);
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    state.quiz.correctCount = 0;
    state.quiz.active = true;
    state.quiz.startTime = Date.now();

    document.getElementById('quizSelection').classList.add('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizActive').classList.remove('hidden');

    showQuestion();
}

function showQuestion() {
    const quiz = state.quiz;
    const question = quiz.questions[quiz.currentIndex];
    const total = quiz.questions.length;

    document.getElementById('quizQuestionNum').textContent = `${quiz.currentIndex + 1}/${total}`;
    document.getElementById('quizScore').textContent = quiz.score;
    document.getElementById('quizProgressFill').style.width = `${((quiz.currentIndex) / total) * 100}%`;

    document.getElementById('quizQuestion').innerHTML = question.q;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = question.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">${opt}</button>
    `).join('');

    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)));
    });

    document.getElementById('quizFeedback').classList.add('hidden');

    // Start timer
    quiz.timer = 30;
    document.getElementById('quizTimer').textContent = `0:30`;
    clearInterval(quiz.timerInterval);
    quiz.timerInterval = setInterval(() => {
        quiz.timer--;
        const secs = quiz.timer.toString().padStart(2, '0');
        document.getElementById('quizTimer').textContent = `0:${secs}`;
        if (quiz.timer <= 0) {
            clearInterval(quiz.timerInterval);
            selectAnswer(-1); // Time's up
        }
    }, 1000);
}

function selectAnswer(selectedIndex) {
    const quiz = state.quiz;
    const question = quiz.questions[quiz.currentIndex];
    clearInterval(quiz.timerInterval);

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(btn => {
        btn.classList.add('disabled');
        const idx = parseInt(btn.dataset.index);
        if (idx === question.answer) btn.classList.add('correct');
        if (idx === selectedIndex && idx !== question.answer) btn.classList.add('incorrect');
    });

    const isCorrect = selectedIndex === question.answer;
    const xpMap = { easy: 10, medium: 25, hard: 50 };
    const xpEarned = isCorrect ? xpMap[quiz.difficulty] : 0;

    if (isCorrect) {
        quiz.score += xpEarned;
        quiz.correctCount++;
    }

    const feedback = document.getElementById('quizFeedback');
    feedback.classList.remove('hidden');
    document.getElementById('feedbackIcon').innerHTML = isCorrect ? '&#9989;' : (selectedIndex === -1 ? '&#9203;' : '&#10060;');
    document.getElementById('feedbackText').textContent = isCorrect ? 'Correct!' : (selectedIndex === -1 ? "Time's up!" : 'Incorrect');
    document.getElementById('feedbackExplanation').textContent = question.explanation;

    const isLast = quiz.currentIndex >= quiz.questions.length - 1;
    document.getElementById('nextQuestionBtn').textContent = isLast ? 'See Results' : 'Next Question';
}

function nextQuestion() {
    const quiz = state.quiz;
    quiz.currentIndex++;

    if (quiz.currentIndex >= quiz.questions.length) {
        showResults();
    } else {
        showQuestion();
    }
}

function showResults() {
    const quiz = state.quiz;
    quiz.active = false;
    clearInterval(quiz.timerInterval);

    const total = quiz.questions.length;
    const accuracy = Math.round((quiz.correctCount / total) * 100);
    const elapsed = Math.round((Date.now() - quiz.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');

    let trophy, title;
    if (accuracy >= 90) { trophy = '&#127942;'; title = 'Outstanding!'; }
    else if (accuracy >= 70) { trophy = '&#127775;'; title = 'Great Job!'; }
    else if (accuracy >= 50) { trophy = '&#128170;'; title = 'Good Effort!'; }
    else { trophy = '&#128218;'; title = 'Keep Practicing!'; }

    document.getElementById('resultsTrophy').innerHTML = trophy;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultScore').textContent = `${quiz.correctCount}/${total}`;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultXP').textContent = `+${quiz.score}`;
    document.getElementById('resultTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    addXP(quiz.score);
    state.user.quizzesCompleted++;
    updateDashboardStats();

    // Post results to backend
    postQuizResults(quiz);
}

function resetQuizUI() {
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizSelection').classList.remove('hidden');
}

// ---- Post quiz results to backend ----
async function postQuizResults(quiz) {
    try {
        await fetch(`${API_BASE}/quiz-results/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: quiz.topic,
                difficulty: quiz.difficulty,
                score: quiz.score,
                correct_count: quiz.correctCount,
                total_questions: quiz.questions.length,
            }),
            signal: AbortSignal.timeout(3000),
        });
    } catch {
        // Silently fail if backend is unavailable
    }
}

// ---- Simulations ----
function initSimulations() {
    initSimTabs();
    initGraphing();
    initGeometry();
    initProbability();
}

function initSimTabs() {
    document.querySelectorAll('.sim-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sim-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`sim-${tab.dataset.sim}`).classList.add('active');
        });
    });
}

// -- Function Grapher --
function initGraphing() {
    document.getElementById('plotBtn').addEventListener('click', plotFunction);
    plotFunction(); // Initial plot
}

function plotFunction() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const funcStr = document.getElementById('functionInput').value;
    const xMin = parseFloat(document.getElementById('xMin').value) || -10;
    const xMax = parseFloat(document.getElementById('xMax').value) || 10;

    const W = canvas.width;
    const H = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, 0, W, H);

    // Grid
    const plotW = W - 2 * padding;
    const plotH = H - 2 * padding;

    // Calculate y range by sampling
    let yMin = Infinity, yMax = -Infinity;
    const samples = [];
    const step = (xMax - xMin) / 500;

    for (let x = xMin; x <= xMax; x += step) {
        try {
            const y = evaluateFunction(funcStr, x);
            if (isFinite(y)) {
                samples.push({ x, y });
                if (y < yMin) yMin = y;
                if (y > yMax) yMax = y;
            }
        } catch { /* skip */ }
    }

    if (samples.length === 0) {
        ctx.fillStyle = '#E74C3C';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Could not evaluate function', W / 2, H / 2);
        return;
    }

    // Add padding to y range
    const yPad = (yMax - yMin) * 0.1 || 1;
    yMin -= yPad;
    yMax += yPad;

    function toScreenX(x) { return padding + ((x - xMin) / (xMax - xMin)) * plotW; }
    function toScreenY(y) { return padding + ((yMax - y) / (yMax - yMin)) * plotH; }

    // Grid lines
    ctx.strokeStyle = '#2D2D4A';
    ctx.lineWidth = 1;

    const xGridStep = niceStep(xMax - xMin, 10);
    for (let gx = Math.ceil(xMin / xGridStep) * xGridStep; gx <= xMax; gx += xGridStep) {
        const sx = toScreenX(gx);
        ctx.beginPath();
        ctx.moveTo(sx, padding);
        ctx.lineTo(sx, H - padding);
        ctx.stroke();
        ctx.fillStyle = '#5A5A7A';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(formatNum(gx), sx, H - padding + 18);
    }

    const yGridStep = niceStep(yMax - yMin, 8);
    for (let gy = Math.ceil(yMin / yGridStep) * yGridStep; gy <= yMax; gy += yGridStep) {
        const sy = toScreenY(gy);
        ctx.beginPath();
        ctx.moveTo(padding, sy);
        ctx.lineTo(W - padding, sy);
        ctx.stroke();
        ctx.fillStyle = '#5A5A7A';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(formatNum(gy), padding - 8, sy + 4);
    }

    // Axes
    if (xMin <= 0 && xMax >= 0) {
        ctx.strokeStyle = '#5A5A7A';
        ctx.lineWidth = 2;
        const zeroX = toScreenX(0);
        ctx.beginPath();
        ctx.moveTo(zeroX, padding);
        ctx.lineTo(zeroX, H - padding);
        ctx.stroke();
    }

    if (yMin <= 0 && yMax >= 0) {
        ctx.strokeStyle = '#5A5A7A';
        ctx.lineWidth = 2;
        const zeroY = toScreenY(0);
        ctx.beginPath();
        ctx.moveTo(padding, zeroY);
        ctx.lineTo(W - padding, zeroY);
        ctx.stroke();
    }

    // Plot function
    ctx.strokeStyle = '#6C5CE7';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(108, 92, 231, 0.5)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    let started = false;
    for (const { x, y } of samples) {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        if (sy >= padding - 10 && sy <= H - padding + 10) {
            if (!started) { ctx.moveTo(sx, sy); started = true; }
            else ctx.lineTo(sx, sy);
        } else {
            started = false;
        }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Title
    ctx.fillStyle = '#A29BFE';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`f(x) = ${funcStr}`, padding, 24);
}

function evaluateFunction(funcStr, x) {
    const fn = new Function('x', 'Math', `return ${funcStr}`);
    return fn(x, Math);
}

function niceStep(range, targetTicks) {
    const rough = range / targetTicks;
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = rough / pow;
    let nice;
    if (norm < 1.5) nice = 1;
    else if (norm < 3) nice = 2;
    else if (norm < 7) nice = 5;
    else nice = 10;
    return nice * pow;
}

function formatNum(n) {
    if (Math.abs(n) < 0.0001) return '0';
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 1) return parseFloat(n.toFixed(2)).toString();
    return parseFloat(n.toFixed(4)).toString();
}

// -- Geometry Lab --
function initGeometry() {
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            shapeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderShapeInputs(btn.dataset.shape);
        });
    });

    document.getElementById('drawShapeBtn').addEventListener('click', drawShape);
    renderShapeInputs('triangle');
}

function renderShapeInputs(shape) {
    const container = document.getElementById('shapeInputs');

    const inputs = {
        triangle: `
            <div class="input-group"><label>Side A</label><input type="number" id="triA" value="3"></div>
            <div class="input-group"><label>Side B</label><input type="number" id="triB" value="4"></div>
            <div class="input-group"><label>Side C</label><input type="number" id="triC" value="5"></div>
        `,
        circle: `
            <div class="input-group"><label>Radius</label><input type="number" id="circR" value="5"></div>
        `,
        rectangle: `
            <div class="input-group"><label>Width</label><input type="number" id="rectW" value="6"></div>
            <div class="input-group"><label>Height</label><input type="number" id="rectH" value="4"></div>
        `,
    };

    container.innerHTML = `<div style="display:flex;gap:12px;flex-wrap:wrap;">${inputs[shape]}</div>`;
}

function drawShape() {
    const canvas = document.getElementById('geometryCanvas');
    const ctx = canvas.getContext('2d');
    const activeShape = document.querySelector('.shape-btn.active').dataset.shape;
    const results = document.getElementById('geometryResults');

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, 0, W, H);

    if (activeShape === 'triangle') {
        const a = parseFloat(document.getElementById('triA').value) || 3;
        const b = parseFloat(document.getElementById('triB').value) || 4;
        const c = parseFloat(document.getElementById('triC').value) || 5;

        if (a + b <= c || a + c <= b || b + c <= a) {
            results.innerHTML = '<strong>Invalid triangle!</strong> The sides do not satisfy the triangle inequality.';
            return;
        }

        // Heron's formula
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const perimeter = a + b + c;

        // Calculate vertices
        const scale = Math.min(W, H) * 0.6 / Math.max(a, b, c);
        const x1 = W / 2 - (a * scale) / 2;
        const y1 = H / 2 + (area * 2 / a * scale) / 3;
        const x2 = x1 + a * scale;
        const y2 = y1;
        const cosA = (a * a + b * b - c * c) / (2 * a * b);
        const sinA = Math.sqrt(1 - cosA * cosA);
        const x3 = x1 + b * scale * cosA;
        const y3 = y1 - b * scale * sinA;

        // Draw
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fillStyle = 'rgba(108, 92, 231, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#6C5CE7';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#A29BFE';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`a = ${a}`, (x1 + x2) / 2, y1 + 25);
        ctx.fillText(`b = ${b}`, (x1 + x3) / 2 - 25, (y1 + y3) / 2);
        ctx.fillText(`c = ${c}`, (x2 + x3) / 2 + 25, (y2 + y3) / 2);

        results.innerHTML = `<strong>Perimeter:</strong> ${perimeter.toFixed(2)} &nbsp; | &nbsp; <strong>Area:</strong> ${area.toFixed(2)}`;
    } else if (activeShape === 'circle') {
        const r = parseFloat(document.getElementById('circR').value) || 5;
        const scale = Math.min(W, H) * 0.35 / r;

        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r * scale, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 184, 148, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#00B894';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Radius line
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        ctx.lineTo(W / 2 + r * scale, H / 2);
        ctx.strokeStyle = '#00CEC9';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00CEC9';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`r = ${r}`, W / 2 + r * scale / 2, H / 2 - 12);

        const area = Math.PI * r * r;
        const circumference = 2 * Math.PI * r;
        results.innerHTML = `<strong>Area:</strong> ${area.toFixed(2)} &nbsp; | &nbsp; <strong>Circumference:</strong> ${circumference.toFixed(2)}`;
    } else if (activeShape === 'rectangle') {
        const w = parseFloat(document.getElementById('rectW').value) || 6;
        const h = parseFloat(document.getElementById('rectH').value) || 4;
        const scale = Math.min(W * 0.6 / w, H * 0.6 / h);

        const rx = (W - w * scale) / 2;
        const ry = (H - h * scale) / 2;

        ctx.fillStyle = 'rgba(9, 132, 227, 0.15)';
        ctx.fillRect(rx, ry, w * scale, h * scale);
        ctx.strokeStyle = '#0984E3';
        ctx.lineWidth = 3;
        ctx.strokeRect(rx, ry, w * scale, h * scale);

        ctx.fillStyle = '#74B9FF';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`w = ${w}`, rx + (w * scale) / 2, ry + h * scale + 25);
        ctx.save();
        ctx.translate(rx - 15, ry + (h * scale) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`h = ${h}`, 0, 0);
        ctx.restore();

        const area = w * h;
        const perimeter = 2 * (w + h);
        const diagonal = Math.sqrt(w * w + h * h);
        results.innerHTML = `<strong>Area:</strong> ${area.toFixed(2)} &nbsp; | &nbsp; <strong>Perimeter:</strong> ${perimeter.toFixed(2)} &nbsp; | &nbsp; <strong>Diagonal:</strong> ${diagonal.toFixed(2)}`;
    }
}

// -- Probability Simulator --
function initProbability() {
    document.querySelectorAll('.prob-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.prob-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('runSimBtn').addEventListener('click', runProbabilitySim);
}

function runProbabilitySim() {
    const canvas = document.getElementById('probabilityCanvas');
    const ctx = canvas.getContext('2d');
    const results = document.getElementById('probabilityResults');
    const type = document.querySelector('.prob-btn.active').dataset.prob;
    const trials = Math.min(parseInt(document.getElementById('trialCount').value) || 100, 10000);

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, 0, W, H);

    if (type === 'coin') {
        let heads = 0, tails = 0;
        for (let i = 0; i < trials; i++) {
            if (Math.random() < 0.5) heads++;
            else tails++;
        }

        const maxVal = Math.max(heads, tails);
        const barW = 120;
        const maxH = H - 120;
        const hBarH = (heads / maxVal) * maxH;
        const tBarH = (tails / maxVal) * maxH;

        // Heads bar
        const hx = W / 2 - barW - 30;
        const hy = H - 60 - hBarH;
        const gradient1 = ctx.createLinearGradient(hx, hy, hx, H - 60);
        gradient1.addColorStop(0, '#6C5CE7');
        gradient1.addColorStop(1, '#A29BFE');
        ctx.fillStyle = gradient1;
        ctx.roundRect(hx, hy, barW, hBarH, [8, 8, 0, 0]);
        ctx.fill();

        // Tails bar
        const tx = W / 2 + 30;
        const ty = H - 60 - tBarH;
        const gradient2 = ctx.createLinearGradient(tx, ty, tx, H - 60);
        gradient2.addColorStop(0, '#00B894');
        gradient2.addColorStop(1, '#55EFC4');
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.roundRect(tx, ty, barW, tBarH, [8, 8, 0, 0]);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#E8E8F0';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`Heads: ${heads}`, hx + barW / 2, hy - 12);
        ctx.fillText(`Tails: ${tails}`, tx + barW / 2, ty - 12);

        ctx.font = '13px Inter';
        ctx.fillStyle = '#8888A8';
        ctx.fillText(`${((heads / trials) * 100).toFixed(1)}%`, hx + barW / 2, H - 40);
        ctx.fillText(`${((tails / trials) * 100).toFixed(1)}%`, tx + barW / 2, H - 40);

        ctx.font = 'bold 14px Inter';
        ctx.fillStyle = '#A29BFE';
        ctx.fillText(`${trials} coin flips`, W / 2, 30);

        results.innerHTML = `
            <strong>Heads:</strong> ${heads} (${((heads/trials)*100).toFixed(1)}%) &nbsp; | &nbsp;
            <strong>Tails:</strong> ${tails} (${((tails/trials)*100).toFixed(1)}%) &nbsp; | &nbsp;
            <strong>Expected:</strong> 50% each &nbsp; | &nbsp;
            <strong>Deviation:</strong> ${Math.abs(((heads/trials)*100) - 50).toFixed(1)}%
        `;
    } else if (type === 'dice') {
        const counts = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < trials; i++) {
            counts[Math.floor(Math.random() * 6)]++;
        }

        const maxVal = Math.max(...counts);
        const barW = 80;
        const gap = 20;
        const totalW = 6 * barW + 5 * gap;
        const startX = (W - totalW) / 2;
        const maxH = H - 130;

        const colors = ['#6C5CE7', '#0984E3', '#00B894', '#F39C12', '#E74C3C', '#FD79A8'];

        counts.forEach((count, i) => {
            const bH = (count / maxVal) * maxH;
            const bx = startX + i * (barW + gap);
            const by = H - 60 - bH;

            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.roundRect(bx, by, barW, bH, [8, 8, 0, 0]);
            ctx.fill();

            ctx.fillStyle = '#E8E8F0';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(count.toString(), bx + barW / 2, by - 10);

            ctx.font = 'bold 18px Inter';
            ctx.fillText(`${i + 1}`, bx + barW / 2, H - 35);

            ctx.font = '11px Inter';
            ctx.fillStyle = '#8888A8';
            ctx.fillText(`${((count / trials) * 100).toFixed(1)}%`, bx + barW / 2, H - 16);
        });

        ctx.font = 'bold 14px Inter';
        ctx.fillStyle = '#A29BFE';
        ctx.textAlign = 'center';
        ctx.fillText(`${trials} dice rolls`, W / 2, 30);

        const expected = (100 / 6).toFixed(1);
        results.innerHTML = `
            <strong>Results:</strong> ${counts.map((c, i) => `${i + 1}: ${c}`).join(' | ')} &nbsp; | &nbsp;
            <strong>Expected per face:</strong> ${expected}%
        `;
    }
}

// ---- Progress Page ----
function initProgress() {
    renderMastery();
    renderBadges();
    updateLevelRing();
}

function renderMastery() {
    const container = document.getElementById('masteryList');
    const colors = {
        arithmetic: '#6C5CE7', algebra: '#0984E3', geometry: '#00B894',
        fractions: '#F39C12', statistics: '#E74C3C', calculus: '#00CEC9',
    };

    container.innerHTML = state.modules.map(m => `
        <div class="mastery-item">
            <div class="mastery-name">${m.title}</div>
            <div class="mastery-bar">
                <div class="mastery-fill" style="width: ${m.progress}%; background: ${colors[m.id]}"></div>
            </div>
            <div class="mastery-percent">${m.progress}%</div>
        </div>
    `).join('');
}

function renderBadges() {
    const container = document.getElementById('badgesGrid');
    container.innerHTML = state.badges.map(b => `
        <div class="badge-item ${b.unlocked ? '' : 'locked'}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
        </div>
    `).join('');
}

function updateLevelRing() {
    const fill = document.getElementById('levelRingFill');
    const circumference = 2 * Math.PI * 54;
    const progress = state.user.xp / state.user.nextLevelXP;
    const offset = circumference - (progress * circumference);

    setTimeout(() => {
        fill.style.strokeDashoffset = offset;
    }, 300);
}

// ---- Utilities ----
function addXP(amount) {
    state.user.xp += amount;
    document.getElementById('xpCount').textContent = state.user.xp.toLocaleString();
    document.getElementById('currentXP').textContent = state.user.xp.toLocaleString();
    updateLevelRing();

    // Check level up
    if (state.user.xp >= state.user.nextLevelXP) {
        state.user.level++;
        state.user.xp -= state.user.nextLevelXP;
        state.user.nextLevelXP = Math.round(state.user.nextLevelXP * 1.5);
        document.getElementById('levelNumber').textContent = state.user.level;
        document.getElementById('nextLevelXP').textContent = state.user.nextLevelXP.toLocaleString();
        showToast(`Level Up! You're now Level ${state.user.level}!`, 'success');
    }
}

function updateDashboardStats() {
    document.getElementById('quizzesCompleted').textContent = state.user.quizzesCompleted;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '&#9989;', error: '&#10060;', info: '&#8505;', xp: '&#11088;' };
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
