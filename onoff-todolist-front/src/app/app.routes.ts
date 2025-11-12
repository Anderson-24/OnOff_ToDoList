import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./view/layout/base-layout/base-layout.component').then(
        (c) => c.BaseLayoutComponent
      ),
    canActivate: [() => inject(AuthGuard).canActivate()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./view/pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'tareas',
        loadComponent: () =>
          import('./view/pages/task/task.component').then(
            (c) => c.TaskComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./view/layout/login-layout/login-layout.component').then(
        (c) => c.LoginLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./view/pages/auth/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
