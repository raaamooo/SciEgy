// SciStudy Egypt - Main JavaScript Functionality
class SciStudyApp {
    constructor() {
        this.currentFlashcardIndex = 0;
        this.flashcards = [];
        this.isFlipped = false;
        this.studyMode = 'en-to-ar'; // 'en-to-ar' or 'ar-to-en'
        this.currentFilter = 'all';
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        this.userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        this.studyStats = JSON.parse(localStorage.getItem('studyStats') || '{ "termsLearned": 0, "studyStreak": 0, "studyTime": 0 }');
        
        this.init();
    }
    
    init() {
        this.initializeTypedText();
        this.setupEventListeners();
        this.loadUserData();
        this.updateStats();
        this.loadRecentSearches();
        this.initializeSplitting();
    }
    
    initializeTypedText() {
        if (document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'Learn Scientific Terms',
                    'ترجمة المصطلحات العلمية',
                    'Master Your Studies',
                    'احترف دراستك'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: false
            });
        }
    }
    
    initializeSplitting() {
        if (typeof Splitting !== 'undefined') {
            Splitting();
        }
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Translation search
        const searchInput = document.getElementById('translation-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        // Category filters
        ['biology-filter', 'chemistry-filter', 'physics-filter'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.setFilter(id.replace('-filter', ''));
                });
            }
        });
        
        // Flashcard controls
        const startBtn = document.getElementById('start-flashcards');
        const flipBtn = document.getElementById('flip-card');
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startFlashcards());
        if (flipBtn) flipBtn.addEventListener('click', () => this.flipCard());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());
        
        // Study mode toggle
        const studyModeToggle = document.getElementById('study-mode-toggle');
        if (studyModeToggle) {
            studyModeToggle.addEventListener('click', () => this.toggleStudyMode());
        }
        
        // Difficulty buttons
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            const btn = document.getElementById(`difficulty-${difficulty}`);
            if (btn) {
                btn.addEventListener('click', () => this.setCardDifficulty(difficulty));
            }
        });
        
        // Subject selector
        const subjectSelector = document.getElementById('flashcard-subject');
        if (subjectSelector) {
            subjectSelector.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.generateFlashcards();
            });
        }
        
        // Favorites and pronunciation
        const favoriteBtn = document.getElementById('favorite-btn');
        const pronunciationBtn = document.getElementById('pronunciation-btn');
        
        if (favoriteBtn) favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        if (pronunciationBtn) pronunciationBtn.addEventListener('click', () => this.playPronunciation());
    }
    
    handleSearch(query) {
        if (!query || query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        const results = this.searchTerms(query);
        this.displaySearchResults(results);
        this.addToRecentSearches(query);
    }
    
    searchTerms(query) {
        const allTerms = { ...scientificTerms, ...scientificPhrases };
        const results = [];
        
        Object.entries(allTerms).forEach(([english, arabic]) => {
            if (english.toLowerCase().includes(query.toLowerCase())) {
                const category = this.getTermCategory(english);
                results.push({ english, arabic, category });
            }
        });
        
        return results.slice(0, 10); // Limit to 10 results
    }
    
    getTermCategory(term) {
        // Categorize terms based on content
        const biologyTerms = ['cell', 'organism', 'protein', 'dna', 'gene', 'biology', 'genetics', 'ecology', 'bacteria', 'virus'];
        const chemistryTerms = ['atom', 'element', 'compound', 'molecule', 'reaction', 'chemistry', 'acid', 'base'];
        const physicsTerms = ['force', 'energy', 'work', 'power', 'physics', 'motion', 'velocity', 'acceleration'];
        
        if (biologyTerms.some(t => term.toLowerCase().includes(t))) return 'biology';
        if (chemistryTerms.some(t => term.toLowerCase().includes(t))) return 'chemistry';
        if (physicsTerms.some(t => term.toLowerCase().includes(t))) return 'physics';
        
        return 'general';
    }
    
    displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        const translationResult = document.getElementById('translation-result');
        
        if (results.length === 0) {
            this.hideSearchResults();
            return;
        }
        
        resultsContainer.innerHTML = results.map(result => `
            <div class="p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors search-result-item" 
                 data-term="${result.english}" data-arabic="${result.arabic}" data-category="${result.category}">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-800">${result.english}</p>
                        <p class="arabic-text text-teal-600 text-sm">${result.arabic}</p>
                    </div>
                    <span class="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">${result.category}</span>
                </div>
            </div>
        `).join('');
        
        resultsContainer.classList.remove('hidden');
        
        // Add click handlers to results
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const term = item.dataset.term;
                const arabic = item.dataset.arabic;
                const category = item.dataset.category;
                this.displayTranslation(term, arabic, category);
            });
        });
    }
    
    displayTranslation(english, arabic, category) {
        const translationResult = document.getElementById('translation-result');
        const englishTermEl = document.getElementById('english-term');
        const arabicTermEl = document.getElementById('arabic-term');
        const transliterationEl = document.getElementById('transliteration');
        const categoryEl = document.getElementById('term-category');
        const favoriteBtn = document.getElementById('favorite-btn');
        
        englishTermEl.textContent = english;
        arabicTermEl.textContent = arabic;
        transliterationEl.textContent = this.generateTransliteration(arabic);
        categoryEl.textContent = category;
        
        // Update favorite button state
        const isFavorite = this.favorites.some(fav => fav.english === english);
        favoriteBtn.classList.toggle('active', isFavorite);
        
        translationResult.classList.remove('hidden');
        this.hideSearchResults();
        
        // Store current translation
        this.currentTranslation = { english, arabic, category };
        
        // Animate the result appearance
        anime({
            targets: translationResult,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    generateTransliteration(arabic) {
        // Simple transliteration (this would be more sophisticated in production)
        const transliterationMap = {
            'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
            'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ',
            'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
            'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y'
        };
        
        let result = '';
        for (let char of arabic) {
            result += transliterationMap[char] || char;
        }
        
        return result;
    }
    
    hideSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.classList.add('hidden');
    }
    
    addToRecentSearches(term) {
        if (!this.recentSearches.includes(term)) {
            this.recentSearches.unshift(term);
            this.recentSearches = this.recentSearches.slice(0, 5); // Keep only 5 recent
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
            this.loadRecentSearches();
        }
    }
    
    loadRecentSearches() {
        const container = document.getElementById('recent-searches');
        if (!container) return;
        
        container.innerHTML = this.recentSearches.map(term => `
            <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors recent-search-tag" data-term="${term}">
                ${term}
            </button>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.recent-search-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const term = tag.dataset.term;
                document.getElementById('translation-search').value = term;
                this.handleSearch(term);
            });
        });
    }
    
    toggleFavorite() {
        if (!this.currentTranslation) return;
        
        const favoriteBtn = document.getElementById('favorite-btn');
        const existingIndex = this.favorites.findIndex(fav => fav.english === this.currentTranslation.english);
        
        if (existingIndex >= 0) {
            this.favorites.splice(existingIndex, 1);
            favoriteBtn.classList.remove('active');
        } else {
            this.favorites.push(this.currentTranslation);
            favoriteBtn.classList.add('active');
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateStats();
    }
    
    playPronunciation() {
        // In a real app, this would use Web Speech API or audio files
        // For now, we'll show a visual feedback
        const btn = document.getElementById('pronunciation-btn');
        const originalBg = btn.style.backgroundColor;
        
        btn.style.backgroundColor = '#10b981';
        setTimeout(() => {
            btn.style.backgroundColor = originalBg;
        }, 300);
        
        // Show pronunciation text
        if (this.currentTranslation) {
            const transliterationEl = document.getElementById('transliteration');
            transliterationEl.style.backgroundColor = '#f0fdfa';
            setTimeout(() => {
                transliterationEl.style.backgroundColor = 'transparent';
            }, 1000);
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        // Update button states
        document.querySelectorAll('[id$="-filter"]').forEach(btn => {
            btn.classList.remove('bg-teal-600', 'text-white');
            btn.classList.add('bg-teal-100', 'text-teal-700');
        });
        
        const activeBtn = document.getElementById(`${filter}-filter`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-teal-100', 'text-teal-700');
            activeBtn.classList.add('bg-teal-600', 'text-white');
        }
        
        this.generateFlashcards();
    }
    
    generateFlashcards() {
        const allTerms = { ...scientificTerms, ...scientificPhrases };
        this.flashcards = [];
        
        Object.entries(allTerms).forEach(([english, arabic]) => {
            const category = this.getTermCategory(english);
            
            if (this.currentFilter === 'all' || category === this.currentFilter) {
                this.flashcards.push({ english, arabic, category });
            }
        });
        
        // Shuffle flashcards
        this.flashcards = this.shuffleArray(this.flashcards);
        this.currentFlashcardIndex = 0;
        this.updateFlashcardDisplay();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startFlashcards() {
        if (this.flashcards.length === 0) {
            this.generateFlashcards();
        }
        
        this.currentFlashcardIndex = 0;
        this.isFlipped = false;
        this.updateFlashcardDisplay();
        
        // Hide the start button and show controls
        const startBtn = document.getElementById('start-flashcards');
        startBtn.textContent = 'Restart';
    }
    
    flipCard() {
        const flashcard = document.getElementById('flashcard');
        this.isFlipped = !this.isFlipped;
        
        if (this.isFlipped) {
            flashcard.classList.add('flipped');
        } else {
            flashcard.classList.remove('flipped');
        }
    }
    
    nextCard() {
        if (this.currentFlashcardIndex < this.flashcards.length - 1) {
            this.currentFlashcardIndex++;
            this.isFlipped = false;
            this.updateFlashcardDisplay();
        }
    }
    
    previousCard() {
        if (this.currentFlashcardIndex > 0) {
            this.currentFlashcardIndex--;
            this.isFlipped = false;
            this.updateFlashcardDisplay();
        }
    }
    
    updateFlashcardDisplay() {
        if (this.flashcards.length === 0) return;
        
        const card = this.flashcards[this.currentFlashcardIndex];
        const flashcardTerm = document.getElementById('flashcard-term');
        const flashcardTranslation = document.getElementById('flashcard-translation');
        const flashcardTransliteration = document.getElementById('flashcard-transliteration');
        const flashcardCategory = document.getElementById('flashcard-category');
        const currentCardEl = document.getElementById('current-card');
        const totalCardsEl = document.getElementById('total-cards');
        const progressBar = document.getElementById('progress-bar');
        
        // Reset flip state
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');
        this.isFlipped = false;
        
        // Update card content based on study mode
        if (this.studyMode === 'en-to-ar') {
            flashcardTerm.textContent = card.english;
            flashcardTranslation.textContent = card.arabic;
        } else {
            flashcardTerm.textContent = card.arabic;
            flashcardTranslation.textContent = card.english;
        }
        
        flashcardTransliteration.textContent = this.generateTransliteration(card.arabic);
        flashcardCategory.textContent = card.category;
        
        // Update progress
        currentCardEl.textContent = this.currentFlashcardIndex + 1;
        totalCardsEl.textContent = this.flashcards.length;
        const progress = ((this.currentFlashcardIndex + 1) / this.flashcards.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        
        prevBtn.disabled = this.currentFlashcardIndex === 0;
        nextBtn.disabled = this.currentFlashcardIndex === this.flashcards.length - 1;
    }
    
    toggleStudyMode() {
        this.studyMode = this.studyMode === 'en-to-ar' ? 'ar-to-en' : 'en-to-ar';
        const toggleBtn = document.getElementById('study-mode-toggle');
        toggleBtn.textContent = this.studyMode === 'en-to-ar' ? 'English → Arabic' : 'Arabic → English';
        
        if (this.flashcards.length > 0) {
            this.updateFlashcardDisplay();
        }
    }
    
    setCardDifficulty(difficulty) {
        // In a real app, this would affect the spaced repetition algorithm
        // For now, we'll just provide visual feedback
        const btn = document.getElementById(`difficulty-${difficulty}`);
        
        // Reset all difficulty buttons
        ['easy', 'medium', 'hard'].forEach(d => {
            const b = document.getElementById(`difficulty-${d}`);
            b.classList.remove('ring-2', 'ring-offset-2');
        });
        
        // Highlight selected
        btn.classList.add('ring-2', 'ring-offset-2');
        
        // Animate the button
        anime({
            targets: btn,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
        
        // Move to next card after a delay
        setTimeout(() => {
            this.nextCard();
        }, 500);
    }
    
    updateStats() {
        // Update the statistics display
        document.getElementById('terms-learned').textContent = this.studyStats.termsLearned;
        document.getElementById('study-streak').textContent = this.studyStats.studyStreak;
        document.getElementById('favorites-count').textContent = this.favorites.length;
        document.getElementById('study-time').textContent = Math.floor(this.studyStats.studyTime / 60);
        
        // Save to localStorage
        localStorage.setItem('studyStats', JSON.stringify(this.studyStats));
    }
    
    loadUserData() {
        // Load any existing user data from localStorage
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scistudyApp = new SciStudyApp();
});

// Add some entrance animations
anime({
    targets: '.card-hover',
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(100),
    duration: 600,
    easing: 'easeOutQuad'
});

// Animate stats on load
anime({
    targets: '#terms-learned, #study-streak, #favorites-count, #study-time',
    innerHTML: [0, (el) => el.textContent],
    duration: 1000,
    round: 1,
    easing: 'easeOutQuad'
});
// Add to main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}