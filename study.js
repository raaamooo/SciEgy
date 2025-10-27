// Study Tools JavaScript Functionality
class StudyTools {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('studyNotes') || '[]');
        this.goals = JSON.parse(localStorage.getItem('studyGoals') || JSON.stringify({
            studyHours: 20,
            flashcards: 60,
            notes: 15
        }));
        this.currentEditingNote = null;
        this.subjectFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadNotes();
        this.updateStats();
        this.generateCalendar();
        this.initializeCharts();
        this.updateGoalProgress();
    }
    
    setupEventListeners() {
        // Note management
        document.getElementById('new-note-btn').addEventListener('click', () => this.showNoteEditor());
        document.getElementById('floating-add-btn').addEventListener('click', () => this.showNoteEditor());
        document.getElementById('save-note').addEventListener('click', () => this.saveNote());
        document.getElementById('cancel-note').addEventListener('click', () => this.hideNoteEditor());
        
        // Subject filter
        document.getElementById('subject-filter').addEventListener('change', (e) => {
            this.subjectFilter = e.target.value;
            this.loadNotes();
        });
        
        // Goals modal
        document.getElementById('set-goals-btn').addEventListener('click', () => this.showGoalsModal());
        document.getElementById('save-goals').addEventListener('click', () => this.saveGoals());
        document.getElementById('cancel-goals').addEventListener('click', () => this.hideGoalsModal());
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Auto-save functionality
        document.getElementById('note-content').addEventListener('input', () => {
            if (this.currentEditingNote) {
                this.currentEditingNote.content = document.getElementById('note-content').value;
                this.currentEditingNote.lastModified = Date.now();
            }
        });
        
        document.getElementById('note-title').addEventListener('input', () => {
            if (this.currentEditingNote) {
                this.currentEditingNote.title = document.getElementById('note-title').value;
                this.currentEditingNote.lastModified = Date.now();
            }
        });
    }
    
    showNoteEditor(note = null) {
        const editor = document.getElementById('note-editor');
        const notesList = document.getElementById('notes-list');
        
        editor.classList.remove('hidden');
        notesList.style.display = 'none';
        
        if (note) {
            // Edit existing note
            this.currentEditingNote = note;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-subject').value = note.subject;
            document.getElementById('note-content').value = note.content;
        } else {
            // Create new note
            this.currentEditingNote = {
                id: Date.now().toString(),
                title: '',
                subject: 'biology',
                content: '',
                created: Date.now(),
                lastModified: Date.now()
            };
            document.getElementById('note-title').value = '';
            document.getElementById('note-subject').value = 'biology';
            document.getElementById('note-content').value = '';
        }
        
        // Focus on title input
        document.getElementById('note-title').focus();
    }
    
    hideNoteEditor() {
        const editor = document.getElementById('note-editor');
        const notesList = document.getElementById('notes-list');
        
        editor.classList.add('hidden');
        notesList.style.display = 'block';
        
        this.currentEditingNote = null;
    }
    
    saveNote() {
        if (!this.currentEditingNote) return;
        
        const title = document.getElementById('note-title').value.trim();
        const subject = document.getElementById('note-subject').value;
        const content = document.getElementById('note-content').value.trim();
        
        if (!title || !content) {
            alert('Please fill in both title and content');
            return;
        }
        
        this.currentEditingNote.title = title;
        this.currentEditingNote.subject = subject;
        this.currentEditingNote.content = content;
        this.currentEditingNote.lastModified = Date.now();
        
        // Check if this is a new note or editing existing one
        const existingIndex = this.notes.findIndex(note => note.id === this.currentEditingNote.id);
        
        if (existingIndex >= 0) {
            this.notes[existingIndex] = this.currentEditingNote;
        } else {
            this.notes.unshift(this.currentEditingNote);
        }
        
        this.saveNotesToStorage();
        this.loadNotes();
        this.hideNoteEditor();
        this.updateStats();
        this.updateGoalProgress();
        this.initializeCharts();
        
        // Show success message
        this.showNotification('Note saved successfully!', 'success');
    }
    
    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== noteId);
            this.saveNotesToStorage();
            this.loadNotes();
            this.updateStats();
            this.updateGoalProgress();
            this.initializeCharts();
            
            this.showNotification('Note deleted successfully!', 'success');
        }
    }
    
    loadNotes() {
        const notesList = document.getElementById('notes-list');
        let filteredNotes = this.notes;
        
        // Apply subject filter
        if (this.subjectFilter !== 'all') {
            filteredNotes = this.notes.filter(note => note.subject === this.subjectFilter);
        }
        
        if (filteredNotes.length === 0) {
            notesList.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📝</div>
                    <h4 class="text-xl font-semibold text-gray-800 mb-2">No notes yet</h4>
                    <p class="text-gray-600 mb-4">Create your first study note to get started!</p>
                    <button onclick="window.studyTools.showNoteEditor()" class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                        Create Note
                    </button>
                </div>
            `;
            return;
        }
        
        notesList.innerHTML = filteredNotes.map(note => {
            const subjectNames = {
                biology: 'Biology',
                chemistry: 'Chemistry',
                physics: 'Physics',
                mathematics: 'Mathematics',
                computer: 'Computer Science'
            };
            
            const subjectColors = {
                biology: 'bg-green-100 text-green-700',
                chemistry: 'bg-blue-100 text-blue-700',
                physics: 'bg-purple-100 text-purple-700',
                mathematics: 'bg-orange-100 text-orange-700',
                computer: 'bg-indigo-100 text-indigo-700'
            };
            
            const formattedDate = new Date(note.lastModified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const preview = note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content;
            
            return `
                <div class="note-card bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 mb-1">${note.title}</h4>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="px-2 py-1 ${subjectColors[note.subject]} rounded-full text-xs font-medium">
                                    ${subjectNames[note.subject]}
                                </span>
                                <span class="text-xs text-gray-500">${formattedDate}</span>
                            </div>
                        </div>
                        <div class="flex space-x-1">
                            <button onclick="window.studyTools.showNoteEditor(window.studyTools.notes.find(n => n.id === '${note.id}'))" 
                                    class="p-1 text-gray-400 hover:text-teal-600 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button onclick="window.studyTools.deleteNote('${note.id}')" 
                                    class="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p class="text-gray-700 text-sm leading-relaxed">${preview}</p>
                </div>
            `;
        }).join('');
    }
    
    generateCalendar() {
        const calendar = document.getElementById('study-calendar');
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'text-xs font-medium text-gray-500 p-2';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'p-2';
            calendar.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day p-2 text-sm cursor-pointer rounded';
            dayElement.textContent = day;
            
            // Check if this day has notes
            const dayDate = new Date(currentYear, currentMonth, day);
            const dayTimestamp = dayDate.getTime();
            const nextDayTimestamp = dayDate.getTime() + (24 * 60 * 60 * 1000);
            
            const hasNotes = this.notes.some(note => 
                note.created >= dayTimestamp && note.created < nextDayTimestamp
            );
            
            if (hasNotes) {
                dayElement.classList.add('has-notes');
            }
            
            // Mark today
            if (day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            calendar.appendChild(dayElement);
        }
    }
    
    updateStats() {
        const totalNotes = this.notes.length;
        const thisWeek = this.getNotesThisWeek();
        const favoriteSubject = this.getFavoriteSubject();
        
        document.getElementById('total-notes').textContent = totalNotes;
        document.getElementById('notes-this-week').textContent = thisWeek;
        document.getElementById('favorite-subject').textContent = favoriteSubject;
    }
    
    getNotesThisWeek() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        
        return this.notes.filter(note => note.created >= weekStart.getTime()).length;
    }
    
    getFavoriteSubject() {
        const subjectCounts = {};
        
        this.notes.forEach(note => {
            subjectCounts[note.subject] = (subjectCounts[note.subject] || 0) + 1;
        });
        
        const subjectNames = {
            biology: 'Biology',
            chemistry: 'Chemistry',
            physics: 'Physics',
            mathematics: 'Mathematics',
            computer: 'Computer Science'
        };
        
        let maxCount = 0;
        let favoriteSubject = 'biology';
        
        Object.entries(subjectCounts).forEach(([subject, count]) => {
            if (count > maxCount) {
                maxCount = count;
                favoriteSubject = subject;
            }
        });
        
        return subjectNames[favoriteSubject];
    }
    
    updateGoalProgress() {
        const totalNotes = this.notes.length;
        const notesProgress = Math.min((totalNotes / this.goals.notes) * 100, 100);
        
        // Update progress bars (simplified for demo)
        document.getElementById('notes-progress').textContent = `${totalNotes}/${this.goals.notes}`;
        
        // Animate progress bars
        anime({
            targets: '.goal-progress',
            width: `${notesProgress}%`,
            duration: 1000,
            easing: 'easeOutQuad'
        });
    }
    
    initializeCharts() {
        this.initProgressChart();
        this.initSubjectChart();
    }
    
    initProgressChart() {
        const chart = echarts.init(document.getElementById('progress-chart'));
        
        // Generate sample data for the last 30 days
        const dates = [];
        const noteCounts = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Count notes for this day
            const dayStart = new Date(date).setHours(0, 0, 0, 0);
            const dayEnd = new Date(date).setHours(23, 59, 59, 999);
            const dayNotes = this.notes.filter(note => 
                note.created >= dayStart && note.created <= dayEnd
            ).length;
            
            noteCounts.push(dayNotes);
        }
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
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
                data: dates,
                axisTick: {
                    alignWithLabel: true
                }
            },
            yAxis: {
                type: 'value',
                name: 'Notes Created'
            },
            series: [{
                name: 'Notes',
                type: 'line',
                smooth: true,
                data: noteCounts,
                itemStyle: {
                    color: '#0F4C75'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(15, 76, 117, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(15, 76, 117, 0.1)'
                        }]
                    }
                }
            }]
        };
        
        chart.setOption(option);
    }
    
    initSubjectChart() {
        const chart = echarts.init(document.getElementById('notes-subject-chart'));
        
        const subjectCounts = {};
        this.notes.forEach(note => {
            subjectCounts[note.subject] = (subjectCounts[note.subject] || 0) + 1;
        });
        
        const subjectNames = {
            biology: 'Biology',
            chemistry: 'Chemistry',
            physics: 'Physics',
            mathematics: 'Mathematics',
            computer: 'Computer Science'
        };
        
        const data = Object.entries(subjectCounts).map(([subject, count]) => ({
            name: subjectNames[subject],
            value: count
        }));
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} notes ({d}%)'
            },
            series: [{
                name: 'Notes by Subject',
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
                        const colors = ['#0F4C75', '#F8B500', '#FF6B6B', '#10b981', '#8b5cf6'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }]
        };
        
        chart.setOption(option);
    }
    
    showGoalsModal() {
        const modal = document.getElementById('goals-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Populate current goals
        document.getElementById('goal-study-hours').value = this.goals.studyHours;
        document.getElementById('goal-flashcards').value = this.goals.flashcards;
        document.getElementById('goal-notes').value = this.goals.notes;
    }
    
    hideGoalsModal() {
        const modal = document.getElementById('goals-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    
    saveGoals() {
        const studyHours = parseInt(document.getElementById('goal-study-hours').value);
        const flashcards = parseInt(document.getElementById('goal-flashcards').value);
        const notes = parseInt(document.getElementById('goal-notes').value);
        
        this.goals = { studyHours, flashcards, notes };
        localStorage.setItem('studyGoals', JSON.stringify(this.goals));
        
        this.updateGoalProgress();
        this.hideGoalsModal();
        
        this.showNotification('Goals updated successfully!', 'success');
    }
    
    saveNotesToStorage() {
        localStorage.setItem('studyNotes', JSON.stringify(this.notes));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => notification.remove()
            });
        }, 3000);
    }
}

// Initialize the study tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studyTools = new StudyTools();
    
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