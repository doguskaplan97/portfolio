# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional portfolio website for a Senior Java Software Engineer with 7 years of experience. Built as a static website optimized for GitHub Pages deployment, showcasing technical expertise, project portfolio, and professional experience in Java development and DevOps.

## Architecture

- **Frontend**: Static HTML/CSS/JavaScript website
- **Styling**: CSS Grid/Flexbox with custom CSS variables for theming
- **Animations**: CSS animations with JavaScript intersection observers
- **Responsive**: Mobile-first responsive design
- **Performance**: Optimized for fast loading with lazy loading and reduced motion support

## File Structure

```
portfolio/
├── index.html                 # Main HTML file with all sections
├── css/
│   ├── style.css             # Main styles with CSS Grid/Flexbox
│   └── animations.css        # CSS animations and keyframes
├── js/
│   ├── main.js              # Core JavaScript functionality
│   └── animations.js        # Advanced animations and effects
├── images/
│   ├── profile-placeholder.jpg      # Professional profile photo
│   ├── about-placeholder.jpg        # About section image
│   ├── projects/                    # Project screenshots
│   └── blog/                       # Blog article images
├── assets/
│   └── resume-placeholder.pdf      # Resume download
└── CLAUDE.md                      # This file
```

## Development Commands

```bash
# Local development server
python -m http.server 8000
# or
npx serve

# Access at http://localhost:8000
```

## Key Features

- **Hero Section**: Animated background with typing effect showcasing key technologies
- **Skills Visualization**: Interactive progress bars with hover effects
- **Project Portfolio**: Card-based layout with hover overlays and tech tags
- **Professional Timeline**: Vertical timeline with work experience
- **Contact Form**: Functional form with validation (needs backend integration)
- **Performance Optimized**: Scroll animations, lazy loading, reduced motion support

## Color Scheme

- Primary: `#1a237e` (Deep Navy Blue)
- Secondary: `#ff6f00` (Bright Orange) 
- Accent: `#f5f5f5` (Light Gray)
- Text: `#333333` (Dark Gray)

## Customization Notes

- Replace placeholder images in `/images/` with actual photos
- Update contact links in contact section
- Replace resume placeholder with actual PDF
- Customize company names and project details in HTML
- Adjust skill percentages and technologies as needed

## Deployment

Optimized for GitHub Pages deployment. Ensure all placeholder content is replaced before going live.