// Pomodoro Timer JavaScript Functionality
class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 'focus'; // 'focus', 'shortBreak', 'longBreak'
        this.timeRemaining = 25 * 60; // 25 minutes in seconds
        this.sessionCount = 0;
        this.totalSessions = 4;
        this.timer = null;
        this.focusDuration = 25 * 60;
        this.shortBreakDuration = 5 * 60;
        this.longBreakDuration = 15 * 60;
        
        // Load saved data
        this.stats = JSON.parse(localStorage.getItem('pomodoroStats') || JSON.stringify({
            sessionsToday: 0,
            focusTimeToday: 0,
            studyStreak: 0,
            weeklyData: [0, 0, 0, 0, 0, 0, 0],
            subjectData: {
                general: 0,
                biology: 0,
                chemistry: 0,
                physics: 0,
                mathematics: 0,
                computer: 0
            }
        }));
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.initializeCharts();
        this.loadSettings();
    }
    
    setupEventListeners() {
        // Timer controls
        document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
        document.getElementById('pause-timer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('reset-timer').addEventListener('click', () => this.resetTimer());
        
        // Settings
        document.getElementById('focus-duration').addEventListener('change', (e) => {
            this.focusDuration = parseInt(e.target.value) * 60;
            if (!this.isRunning && this.currentPhase === 'focus') {
                this.timeRemaining = this.focusDuration;
                this.updateDisplay();
            }
        });
        
        document.getElementById('short-break').addEventListener('change', (e) => {
            this.shortBreakDuration = parseInt(e.target.value) * 60;
        });
        
        document.getElementById('long-break').addEventListener('change', (e) => {
            this.longBreakDuration = parseInt(e.target.value) * 60;
        });
        
        // Quick actions
        document.getElementById('quick-5min').addEventListener('click', () => this.startQuickSession());
        document.getElementById('quick-review').addEventListener('click', () => this.startReviewSession());
        document.getElementById('take-notes').addEventListener('click', () => this.openNotes());
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    startTimer() {
        if (this.isPaused) {
            this.isPaused = false;
        } else {
            this.timeRemaining = this.getCurrentPhaseDuration();
        }
        
        this.isRunning = true;
        this.updateButtonStates();
        this.startPulseAnimation();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
        
        // Save start time for tracking
        this.sessionStartTime = Date.now();
    }
    
    pauseTimer() {
        this.isPaused = true;
        this.isRunning = false;
        clearInterval(this.timer);
        this.updateButtonStates();
        this.stopPulseAnimation();
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        this.timeRemaining = this.getCurrentPhaseDuration();
        this.updateDisplay();
        this.updateButtonStates();
        this.stopPulseAnimation();
        this.updateProgress();
    }
    
    completeSession() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        // Calculate session time
        const sessionTime = this.getCurrentPhaseDuration();
        
        if (this.currentPhase === 'focus') {
            this.sessionCount++;
            this.stats.sessionsToday++;
            this.stats.focusTimeToday += sessionTime;
            
            // Update subject data
            const subject = document.getElementById('study-subject').value;
            this.stats.subjectData[subject] += sessionTime;
            
            // Update weekly data (assuming today is the current day)
            const today = new Date().getDay();
            this.stats.weeklyData[today] += sessionTime;
            
            // Check for achievements
            this.checkAchievements();
            
            // Determine next phase
            if (this.sessionCount % 4 === 0) {
                this.startLongBreak();
            } else {
                this.startShortBreak();
            }
        } else {
            this.currentPhase = 'focus';
            this.timeRemaining = this.focusDuration;
            this.updateDisplay();
        }
        
        this.updateStats();
        this.saveStats();
        this.updateButtonStates();
        this.stopPulseAnimation();
    }
    
    startShortBreak() {
        this.currentPhase = 'shortBreak';
        this.timeRemaining = this.shortBreakDuration;
        this.showBreakActivities();
        this.updateDisplay();
        this.startTimer();
    }
    
    startLongBreak() {
        this.currentPhase = 'longBreak';
        this.timeRemaining = this.longBreakDuration;
        this.showBreakActivities();
        this.updateDisplay();
        this.startTimer();
    }
    
    getCurrentPhaseDuration() {
        switch (this.currentPhase) {
            case 'focus': return this.focusDuration;
            case 'shortBreak': return this.shortBreakDuration;
            case 'longBreak': return this.longBreakDuration;
            default: return this.focusDuration;
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timer-display').textContent = display;
        
        // Update phase display
        const phaseEl = document.getElementById('timer-phase');
        const sessionEl = document.getElementById('timer-session');
        
        switch (this.currentPhase) {
            case 'focus':
                phaseEl.textContent = 'Focus Time';
                sessionEl.textContent = `Session ${this.sessionCount + 1} of ${this.totalSessions}`;
                break;
            case 'shortBreak':
                phaseEl.textContent = 'Short Break';
                sessionEl.textContent = 'Take a quick rest';
                break;
            case 'longBreak':
                phaseEl.textContent = 'Long Break';
                sessionEl.textContent = 'Time for a longer rest';
                break;
        }
        
        // Update progress circle
        this.updateTimerCircle();
        
        // Update current subject display
        const subject = document.getElementById('study-subject').value;
        const subjectNames = {
            general: { en: 'General Study', ar: 'دراسة عامة' },
            biology: { en: 'Biology', ar: 'علم الأحياء' },
            chemistry: { en: 'Chemistry', ar: 'كيمياء' },
            physics: { en: 'Physics', ar: 'فيزياء' },
            mathematics: { en: 'Mathematics', ar: 'رياضيات' },
            computer: { en: 'Computer Science', ar: 'علم الحاسوب' }
        };
        
        const subjectData = subjectNames[subject];
        document.getElementById('current-subject').textContent = subjectData.en;
        document.getElementById('current-subject-ar').textContent = subjectData.ar;
    }
    
    updateTimerCircle() {
        const progress = 1 - (this.timeRemaining / this.getCurrentPhaseDuration());
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference * (1 - progress);
        
        const progressCircle = document.getElementById('timer-progress');
        progressCircle.style.strokeDashoffset = offset;
        
        // Change color based on phase
        switch (this.currentPhase) {
            case 'focus':
                progressCircle.style.stroke = '#0F4C75';
                break;
            case 'shortBreak':
            case 'longBreak':
                progressCircle.style.stroke = '#10b981';
                break;
        }
    }
    
    updateButtonStates() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');
        const resetBtn = document.getElementById('reset-timer');
        
        if (this.isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }
        
        // Update start button text based on phase
        if (!this.isRunning) {
            switch (this.currentPhase) {
                case 'focus':
                    startBtn.textContent = 'Start Focus';
                    break;
                case 'shortBreak':
                    startBtn.textContent = 'Start Short Break';
                    break;
                case 'longBreak':
                    startBtn.textContent = 'Start Long Break';
                    break;
            }
        }
    }
    
    updateProgress() {
        const progress = 1 - (this.timeRemaining / this.getCurrentPhaseDuration());
        const progressBar = document.getElementById('session-progress');
        const progressText = document.getElementById('session-progress-text');
        
        progressBar.style.width = `${progress * 100}%`;
        progressText.textContent = `${Math.round(progress * 100)}%`;
    }
    
    startPulseAnimation() {
        const pulseRing = document.getElementById('pulse-ring');
        if (this.isRunning) {
            pulseRing.classList.add('pulse-ring');
            pulseRing.style.opacity = '1';
        }
    }
    
    stopPulseAnimation() {
        const pulseRing = document.getElementById('pulse-ring');
        pulseRing.classList.remove('pulse-ring');
        pulseRing.style.opacity = '0';
    }
    
    showBreakActivities() {
        const breakActivities = document.getElementById('break-activities');
        breakActivities.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            breakActivities.classList.add('hidden');
        }, 3000);
    }
    
    updateStats() {
        document.getElementById('sessions-today').textContent = this.stats.sessionsToday;
        
        const focusHours = Math.floor(this.stats.focusTimeToday / 3600);
        const focusMinutes = Math.floor((this.stats.focusTimeToday % 3600) / 60);
        document.getElementById('focus-time-today').textContent = `${focusHours}h ${focusMinutes}m`;
        
        document.getElementById('study-streak').textContent = `${this.stats.studyStreak} days`;
    }
    
    initializeCharts() {
        this.initWeeklyChart();
        this.initSubjectChart();
    }
    
    initWeeklyChart() {
        const chart = echarts.init(document.getElementById('weekly-chart'));
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                axisTick: {
                    alignWithLabel: true
                }
            },
            yAxis: {
                type: 'value',
                name: 'Minutes'
            },
            series: [{
                name: 'Study Time',
                type: 'bar',
                barWidth: '60%',
                data: this.stats.weeklyData.map(time => Math.round(time / 60)),
                itemStyle: {
                    color: '#0F4C75'
                }
            }]
        };
        
        chart.setOption(option);
    }
    
    initSubjectChart() {
        const chart = echarts.init(document.getElementById('subject-chart'));
        
        const data = Object.entries(this.stats.subjectData)
            .filter(([subject, time]) => time > 0)
            .map(([subject, time]) => ({
                name: subject.charAt(0).toUpperCase() + subject.slice(1),
                value: Math.round(time / 60)
            }));
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} minutes ({d}%)'
            },
            series: [{
                name: 'Study Time',
                type: 'pie',
                radius: '70%',
                center: ['50%', '50%'],
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    color: function(params) {
                        const colors = ['#0F4C75', '#F8B500', '#FF6B6B', '#10b981', '#8b5cf6', '#f59e0b'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }]
        };
        
        chart.setOption(option);
    }
    
    checkAchievements() {
        // Check for new achievements
        if (this.stats.sessionsToday === 1) {
            this.showAchievement('First Session Complete! 🎉', 'You completed your first study session today!');
        }
        
        if (this.stats.sessionsToday === 4) {
            this.showAchievement('Daily Goal Met! 🎯', 'You completed 4 focus sessions today!');
        }
        
        if (this.stats.studyStreak === 7) {
            this.showAchievement('Week Streak! 🔥', 'You studied for 7 days in a row!');
        }
    }
    
    showAchievement(title, message) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 achievement-badge';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">🏆</div>
                <div>
                    <h4 class="font-semibold text-gray-800">${title}</h4>
                    <p class="text-sm text-gray-600">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    startQuickSession() {
        this.focusDuration = 5 * 60; // 5 minutes
        this.currentPhase = 'focus';
        this.timeRemaining = this.focusDuration;
        this.updateDisplay();
        this.startTimer();
    }
    
    startReviewSession() {
        window.location.href = 'index.html#flashcards';
    }
    
    openNotes() {
        window.location.href = 'study.html';
    }
    
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
        
        if (settings.focusDuration) {
            this.focusDuration = settings.focusDuration;
            document.getElementById('focus-duration').value = settings.focusDuration / 60;
        }
        
        if (settings.shortBreakDuration) {
            this.shortBreakDuration = settings.shortBreakDuration;
            document.getElementById('short-break').value = settings.shortBreakDuration / 60;
        }
        
        if (settings.longBreakDuration) {
            this.longBreakDuration = settings.longBreakDuration;
            document.getElementById('long-break').value = settings.longBreakDuration / 60;
        }
        
        if (!this.isRunning) {
            this.timeRemaining = this.focusDuration;
            this.updateDisplay();
        }
    }
    
    saveStats() {
        localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
        
        // Save settings
        const settings = {
            focusDuration: this.focusDuration,
            shortBreakDuration: this.shortBreakDuration,
            longBreakDuration: this.longBreakDuration
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }
}

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
    
    // Add entrance animations
    anime({
        targets: '.card-hover',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuad'
    });
});