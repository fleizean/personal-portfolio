# [fleizean.dev](https://fleizean.dev)

This is my personal portfolio website, continuously evolving with new sections as I develop and create more projects.

<p align="center">
  <a href="https://fleizean.netlify.app">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//fleizean.dev" alt="Website Status"/>
  </a>
</p>

<p align="center">
  <img src="https://image.thum.io/get/width/800/crop/600/noanimate/https://fleizean.dev" alt="Portfolio website preview" width="800"/>
</p>

## 📋 All Updates

### February 14, 2026

#### 📦 feat: added PkgDiff project to portfolio

- **New Project Entry**: Added PkgDiff to projects showcase
  - Added project card with tech stack (ASP.NET Core, Angular, PostgreSQL, SignalR, Docker, Nginx, Hangfire)
  - Configured live demo link (https://pkgdiff.dev)
  - Set production status badge with green styling

- **Status Badge Update**: Enhanced project status indicators
  - Added new `production` status with green badge
  - Reorganized color scheme: production (green), completed (blue), ongoing (purple)
  - Updated TypeScript types to include production status

- **Project Details**: 
  - Icon: 📦
  - Description highlights: Multi-registry package comparison, GitHub release notes scraping, real-time SignalR updates, admin dashboard
  - GitHub repository link included
  - Placeholder for project screenshot (/others/pkgdiff.png)

### January 14, 2026

#### 🔧 feat: comprehensive linter and formatter setup

- **Prettier Integration**: Added Prettier with consistent code formatting rules
  - Configured 2-space indentation, single quotes, and 100-character line width
  - Created `.prettierrc` and `.prettierignore` files
- **Enhanced ESLint Configuration**: Extended ESLint with best practices
  - Added TypeScript-specific rules and React hooks validation
  - Configured code quality rules (no-console, prefer-const, eqeqeq)
  - Integrated Prettier with ESLint to avoid conflicts
- **New npm Scripts**:
  - `npm run format`: Auto-format all code files
  - `npm run format:check`: Check formatting without changes
  - `npm run lint:fix`: Auto-fix linting issues
- **Automated Code Quality**: Ensures consistent code style across the project

### January 3, 2026

#### 🎨 feat: major UI redesign & gradient aesthetics

- **Global Gradient Theme**: Implemented cohesive gradient borders and backgrounds throughout the site.
- **Page Redesigns**:
  - **Blog**: Modern card design with gradient accents and improved typography.
  - **Contact**: Enhanced form with gradient focus states and interactive buttons.
  - **Projects**: Redesigned status and tech stack badges for better visual hierarchy.
- **Hero Section**: Refined visual elements and added dynamic interactions.
- **Music Player**: Enhanced playback logic with responsive visual feedback.
- **ScrollToTop**: Updated design to match the new aesthetic.

### December 16, 2025

#### feat: medium guru online in my website

- Blogs page added for my medium
- Some localization changed

### October 17, 2025

#### 🚀 feat: comprehensive SEO optimization

- Added complete meta tags (description, author, publisher, robots)
- Implemented Twitter Card metadata (@onlyflei)
- Added Open Graph tags for social media sharing
- Created canonical URLs for all pages
- Generated sitemap.ts and robots.ts files
- Enhanced page descriptions for better search visibility
- Configured proper indexing and crawling rules

#### 🌐 feat: custom domain integration

- Migrated to fleizean.dev domain
- Updated all metadata and canonical URLs
- Configured domain-specific social sharing

---

### July 10, 2025

#### 🐛 fix: dark theme improvements

- Resolved dark theme rendering issues
- Fixed component styling inconsistencies

---

### July 8, 2025

#### 🌙 feat: dark theme system with toggle

- Implemented complete dark theme system
- Added theme toggle in header
- Applied dark mode across all components

---

### June 27, 2025

#### 🌍 feat: complete i18n system (TR/EN) + contact page

- Implemented LanguageContext and LanguageSwitcher
- Converted all pages to use translation system
- Added contact form with API integration
- Fixed TypeScript errors and improved types

---

### June 21, 2025

#### 🎉 First deployment

- Initial portfolio website deployment
