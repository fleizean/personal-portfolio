import type { Routes } from '@angular/router';
import type { DesktopRouteData } from './features/desktop/desktop.routes';

const desktop = () => import('./features/desktop/desktop.page').then((m) => m.DesktopPage);

/**
 * Eski sitedeki adresler korunur (arama motorlarında indeksli): her biri masaüstünü
 * ilgili pencere açık halde getirir.
 */
const page = (path: string, data: DesktopRouteData) => ({ path, loadComponent: desktop, data });

export const routes: Routes = [
  page('', { page: 'home' }),
  page('projects', { page: 'projects', open: { folder: 'projects' } }),
  page('journey', { page: 'journey', open: { folder: 'journey' } }),
  page('tech-stack', { page: 'tech_stack', open: { folder: 'stack' } }),
  page('school-life', { page: 'school_life', open: { folder: 'school' } }),
  page('blog', { page: 'blog', open: { folder: 'blog' } }),
  page('cv', { page: 'cv', open: { file: 'cv.pdf' } }),
  page('contact', { page: 'contact', open: { file: 'contact.sh' } }),
  { path: '**', redirectTo: '' },
];
