import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { NAV_ITEMS } from './core/nav/nav-items';

const PAGES: Record<string, () => Promise<Type<unknown>>> = {
  home: () => import('./features/home/pages/home.page').then((m) => m.HomePage),
  settings: () => import('./features/settings/pages/settings.page').then((m) => m.SettingsPage),
  masters: () => import('./features/masters/pages/masters.page').then((m) => m.MastersPage),
  statistics: () =>
    import('./features/statistics/pages/statistics.page').then((m) => m.StatisticsPage),
  users: () => import('./features/users/pages/users.page').then((m) => m.UsersPage),
  profiles: () => import('./features/profiles/pages/profiles.page').then((m) => m.ProfilesPage),
  marketing: () => import('./features/marketing/pages/marketing.page').then((m) => m.MarketingPage),
  benefits: () => import('./features/benefits/pages/benefits.page').then((m) => m.BenefitsPage),
};

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      ...NAV_ITEMS.map((item) => ({
        path: item.route,
        data: { allowedProfiles: item.allowedProfiles },
        loadComponent: PAGES[item.route],
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
