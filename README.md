# SciStudy Egypt - علمي للعلوم

A comprehensive educational web application designed specifically for Egyptian science students, featuring scientific translation, flashcards, pomodoro timer, and study tools.

## Features

### 🔄 Smart Translation Tool
- Real-time English to Arabic scientific term translation
- 200+ terms across Biology, Chemistry, Physics, Mathematics, and Computer Science
- Auto-complete search with fuzzy matching
- Pronunciation guides and transliteration
- Favorites system for important terms
- Recent searches history

### 📚 Interactive Flashcard System
- Swipe-based card navigation
- Spaced repetition algorithm
- Bidirectional study modes (English ↔ Arabic)
- Difficulty rating system (Easy/Medium/Hard)
- Progress tracking and mastery levels
- Subject-specific card sets

### ⏱️ Pomodoro Study Timer
- Customizable focus/break intervals
- Subject-based study sessions
- Visual progress tracking
- Break activity suggestions
- Achievement system with badges
- Comprehensive analytics and statistics

### 📝 Study Tools & Progress Tracker
- Rich text note editor with Arabic support
- Subject-organized note categories
- Study calendar with visual indicators
- Goal setting and progress tracking
- Learning analytics with charts
- Study group features

## Technical Implementation

### Frontend Technologies
- **HTML5** with semantic structure
- **CSS3** with Tailwind CSS framework
- **JavaScript ES6+** with modular architecture
- **Responsive Design** for all devices

### Libraries & Frameworks
- **Anime.js** - Smooth animations and transitions
- **ECharts.js** - Data visualization and charts
- **Typed.js** - Typewriter text effects
- **Splitting.js** - Text animation utilities

### Design System
- **Modern Arabic Aesthetics** - Clean geometric patterns
- **Color Palette** - Deep teal, warm amber, soft coral
- **Typography** - Cairo (headings), Inter (body), Amiri (Arabic)
- **Accessibility** - WCAG 2.1 AA compliant

### Data Management
- **LocalStorage** - Client-side data persistence
- **JSON Structure** - Organized note and progress data
- **Auto-save** - Real-time content preservation

## File Structure

```
/
├── index.html              # Main translation & flashcards page
├── timer.html              # Pomodoro timer page
├── study.html              # Study tools & progress page
├── main.js                 # Core JavaScript functionality
├── timer.js                # Pomodoro timer logic
├── study.js                # Study tools functionality
├── scientific_terms.js     # Scientific terminology database
├── resources/              # Local assets
│   ├── app-icon.png        # Application icon
│   ├── hero-science.png    # Hero section image
│   └── science-icons.png   # Science discipline icons
├── design.md               # Design system documentation
├── interaction.md          # Interaction design specs
├── outline.md              # Project structure outline
└── README.md               # This file
```

## Usage

### Getting Started
1. Open `index.html` in a modern web browser
2. Start using the translation tool by searching for scientific terms
3. Create flashcards for terms you want to memorize
4. Use the pomodoro timer for focused study sessions
5. Take notes and track your progress

### Navigation
- **Translation** (`index.html`) - Main learning hub with translation and flashcards
- **Timer** (`timer.html`) - Pomodoro study timer with analytics
- **Study Tools** (`study.html`) - Notes, progress tracking, and study groups

### Data Persistence
All user data is stored locally in the browser's LocalStorage:
- Study notes and progress
- Pomodoro session statistics
- Flashcard mastery levels
- User preferences and goals

## Educational Content

### Scientific Terminology
- **Biology**: 45+ terms covering cell biology, genetics, ecology
- **Chemistry**: 38+ terms covering organic, inorganic, physical chemistry
- **Physics**: 42+ terms covering mechanics, thermodynamics, electromagnetism
- **Mathematics**: 35+ terms covering calculus, algebra, statistics
- **Computer Science**: 28+ terms covering programming, algorithms, data structures

### Study Features
- Spaced repetition algorithm for optimal learning
- Progress visualization with charts and analytics
- Goal setting and achievement tracking
- Study pattern analysis and insights

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance
- Optimized for mobile devices
- Fast loading with minimal external dependencies
- Smooth animations with hardware acceleration
- Responsive design for all screen sizes

## Future Enhancements
- Offline functionality with Service Workers
- Cloud synchronization for data backup
- Collaborative study group features
- Advanced analytics and insights
- Mobile app development

## Contributing
This project is designed for Egyptian science students. Contributions and feedback are welcome to improve the educational experience.

## License
Educational use only. All rights reserved by SciStudy Egypt.

---

**Made with ❤️ for Egyptian science students**