# [fleizean.dev](https://fleizean.dev)

This is my personal portfolio website, continuously evolving with new sections as I develop and create more projects.

<p align="center">
  <a href="https://fleizean.dev">
    <img src="https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//fleizean.dev" alt="Website Status"/>
  </a>
</p>

<p align="center">
  <img src="https://image.thum.io/get/width/800/crop/600/noanimate/https://fleizean.dev" alt="Portfolio website preview" width="800"/>
</p>

## 📋 All Updates

### October 12, 2026

#### 🚚 feat: self-hosting with Docker and GitHub Actions

- Moved hosting from Netlify to my own server
- Added `Dockerfile` (Next.js standalone output) and `docker-compose.yml`
- Added `Deploy` workflow: builds the image, pushes it to GHCR and deploys over SSH
- Added nginx vhost config under `deploy/` (TLS termination, www → apex redirect, security headers)

---

#### ⚡ feat: server-side rendering and SEO improvements

- Page content is now rendered on the server instead of after hydration
- Language is resolved on the server from a cookie or `Accept-Language`; `<html lang>` follows it
- Theme class is applied before first paint, removing the white flash in dark mode
- Added generated Open Graph / Twitter image and `Person` JSON-LD
- Added `/blog` and `/cv` to the sitemap
- Medium feed is cached for an hour; WebGL background is lazy-loaded

---

#### 🔒 chore: Next.js 16 upgrade and dependency cleanup

- Upgraded to Next.js 16.4 and refreshed all dependencies — `npm audit` reports 0 vulnerabilities
- Replaced `eslint-config-next` with `typescript-eslint` + React plugins; lint runs through the ESLint CLI
- Removed unused packages: `next-seo`, `i18next`, `react-i18next`, `i18next-browser-languagedetector`

---

#### ✂️ refactor: contact page without the form

- Removed the contact form, its API route and the `nodemailer` / `react-hook-form` dependencies
- No environment variables are needed anymore; the page keeps email, location and social links

---

#### 🐛 fix: small corrections

- Fixed hero image alt text that was rendered as a raw translation key
- Updated the portfolio project link from the old `fleizean.me` domain to `fleizean.dev`
- Added accessible label to the mobile menu button

### March 11, 2026

#### 🗺️ feat: add react-simple-maps and update localization files

- Added `react-simple-maps` dependency and TypeScript definitions
- Created `TravelMap` component — interactive SVG world map centered on the Balkans with zoom/pan, visited country highlighting, city markers, and hover tooltips
- Added travel map section to Journey page
- Updated EN/TR localization files with new keys for travel map title and descriptions
- Added photo links for educational and work experiences in localization files
- Added new meta descriptions for all sections in localization files
- Added institution images: Dumlupınar University and MEBS (`public/others/`)

---

#### ✨ feat: school life section enhancements

- **42 Stats Badge**: Added badge42 stats badge to School Life section, centered below the section title with skeleton loading animation
- **Localization Fix**: Added missing last sentence to Turkish reflection text in School Life section

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
