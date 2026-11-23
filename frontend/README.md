# frontend

Angular 22 (standalone, zoneless, signals), Tailwind CSS 4 and server-side rendering.

```
src/app/
├─ domain/     models and ports (no Angular or HTTP dependencies)
├─ data/       port implementations (static JSON today, the .NET API later)
├─ core/       app-wide services: i18n, theme, SEO
├─ shared/ui/  reusable presentational components
└─ features/   pages and features (desktop)
```

Components keep their template in a separate `.html` file.

```bash
npm install
npm start          # dev server on http://localhost:4200
npm run build      # production build (SSR)
```

Requires Node.js 24.15 or newer.
