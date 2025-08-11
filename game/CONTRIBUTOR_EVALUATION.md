# Contributor Evaluation Report

## Project Overview
**Project Type**: Interactive Browser Game - "Hyrax Runner"  
**Chosen Level**: Level 2 - Interactive Game (95 points maximum)  
**Repository**: Hyrax Game  
**Technology Stack**: TypeScript, HTML5, SCSS, Object-Oriented Programming  

## Evaluation Summary Table

| Contributor | Real Name | Code Level | Technical (40%) | Collaboration (30%) | UX (30%) | Overall Score | Grade |
|-------------|-----------|------------|-----------------|-------------------|----------|---------------|--------|
| Ayala Halevi | Ayala | Intermediate | 28/40 | 21/30 | 22/30 | **71/100** | C |
| nativ | Nativ | Beginner-Intermediate | 22/40 | 18/30 | 20/30 | **60/100** | D |

## Detailed Individual Evaluations

---

### 👤 Contributor: Ayala Halevi
**Real Name**: Ayala  
**Code Level**: Intermediate  
**Overall Score**: 71/100  
**Grade**: C  

#### Technical Excellence (40% weight) - Score: 28/40

**Strengths:**
- ✅ Successfully implemented OOP principles with `Hyrax`, `Obstacle`, and `Cactus` classes showing proper inheritance
- ✅ Good use of TypeScript with type definitions for position objects and proper class properties
- ✅ Implemented collision detection algorithm with bounding box calculations (game/index.ts:184-219)
- ✅ Proper error handling with try-catch blocks throughout the codebase
- ✅ Created smooth sprite animations using CSS keyframes and JavaScript control

**Weaknesses:**
- ❌ No implementation of MVC pattern as required - all logic mixed in single file
- ❌ Duplicate line 56 in index.ts causing syntax error (unclosed setTimeout)
- ❌ Limited use of TypeScript advanced features (no interfaces, generics, or type guards)
- ❌ Code organization issues - all game logic in one file instead of modular structure
- ❌ BEM naming convention not properly implemented in CSS

#### Team Collaboration (30% weight) - Score: 21/30

**Strengths:**
- ✅ Led initial project setup and core game development (9 commits, 60% contribution)
- ✅ Established project foundation with assets and initial structure
- ✅ Progressive feature development from basic setup to collision detection

**Weaknesses:**
- ❌ Poor commit messages ("aa", "aaaa", "update") lacking descriptive information
- ❌ No evidence of code reviews or pull requests
- ❌ Unbalanced contribution distribution (60% vs 40%)

#### User Experience (30% weight) - Score: 22/30

**Strengths:**
- ✅ Created functional endless runner game with jump mechanics
- ✅ Implemented score tracking system (though not displayed/updated during gameplay)
- ✅ Smooth background scrolling and character animations
- ✅ Basic collision detection works correctly

**Weaknesses:**
- ❌ Score display not functional - score variable never incremented during gameplay
- ❌ No game restart mechanism after collision
- ❌ Missing sound effects and feedback
- ❌ Limited difficulty progression or variety

**Recommendations for Improvement:**
1. Refactor code into proper MVC architecture with separate Model, View, and Controller modules
2. Fix the duplicate line bug and implement proper score incrementing system
3. Add TypeScript interfaces for game objects and state management
4. Implement game restart functionality and difficulty levels
5. Study design patterns like Observer pattern for better event handling

---

### 👤 Contributor: nativ
**Real Name**: Nativ  
**Code Level**: Beginner-Intermediate  
**Overall Score**: 60/100  
**Grade**: D  

#### Technical Excellence (40% weight) - Score: 22/40

**Strengths:**
- ✅ Successfully refactored CSS to use viewport-relative units for better responsiveness (game/styles.scss)
- ✅ Improved animation timing and jump mechanics with CSS variables
- ✅ Added score display elements in HTML structure
- ✅ Contributed to debugging and code cleanup efforts

**Weaknesses:**
- ❌ Limited TypeScript implementation - mostly worked on styling and markup
- ❌ No significant architectural contributions or class implementations
- ❌ Auto-generated merge commits suggest limited Git proficiency
- ❌ Did not address core architectural requirements (MVC pattern)
- ❌ Limited contribution to game logic or functionality

#### Team Collaboration (30% weight) - Score: 18/30

**Strengths:**
- ✅ Consistent contribution pattern with 6 commits (40% of total)
- ✅ Focused on UI/UX improvements and styling enhancements
- ✅ Attempted to integrate changes from main branch

**Weaknesses:**
- ❌ Multiple auto-stash and merge commits indicate Git workflow issues
- ❌ Vague commit messages ("PUSH", "staging changes")
- ❌ No evidence of planning or documentation contribution

#### User Experience (30% weight) - Score: 20/30

**Strengths:**
- ✅ Significantly improved visual presentation with responsive CSS
- ✅ Enhanced animation smoothness with better timing functions
- ✅ Added UI elements for score display (though not fully functional)
- ✅ Improved sprite rendering with pixelated image rendering

**Weaknesses:**
- ❌ Score display elements added but not properly connected to game logic
- ❌ No contribution to gameplay features or mechanics
- ❌ Missing user feedback systems or game states
- ❌ No implementation of difficulty levels or progression

**Recommendations for Improvement:**
1. Focus on learning TypeScript fundamentals and OOP concepts
2. Study MVC architecture patterns and implement a simple example
3. Improve Git workflow - learn proper branching, committing, and merging strategies
4. Practice connecting UI elements to application logic
5. Work on implementing complete features from backend logic to frontend display

---

## Team Assessment

### Project Completion
**Completion Percentage**: ~60% of Level 2 requirements  
**Actual Project Level**: Between Level 1 and Level 2  

### Missing Requirements
1. **MVC Architecture**: Not implemented - all code in single file
2. **Proper TypeScript Usage**: Limited use of advanced features
3. **BEM Methodology**: CSS naming doesn't follow BEM convention
4. **Multiple Difficulty Levels**: Not implemented
5. **Complete Scoring System**: Score variable exists but never incremented
6. **Game States**: No pause, restart, or game over screens
7. **Sound Integration**: No audio feedback
8. **Documentation**: No README or setup instructions

### Team Dynamics Assessment
- Unbalanced workload distribution (60/40 split)
- Lack of coordinated planning evident from commit history
- No clear task delegation or specialization
- Git workflow needs improvement (merge conflicts, auto-stashes)

### Project Improvement Priorities
1. **Critical**: Fix syntax error (duplicate line) and implement score incrementing
2. **High**: Refactor to MVC architecture with proper module separation
3. **High**: Add game restart functionality
4. **Medium**: Implement difficulty progression
5. **Medium**: Add sound effects and visual feedback
6. **Low**: Improve commit practices and documentation

## Final Notes

The team created a partially functional browser game showing understanding of basic web development concepts. While the game demonstrates some technical competency with animations and collision detection, it falls short of the Level 2 requirements, particularly in architecture (MVC), TypeScript usage, and completeness of features. Both students would benefit from studying software architecture patterns, improving their TypeScript skills, and learning better collaboration practices through Git.

The project shows promise but needs significant work to meet the full requirements of a Level 2 interactive game. The foundation is there, but execution and architecture need substantial improvement.