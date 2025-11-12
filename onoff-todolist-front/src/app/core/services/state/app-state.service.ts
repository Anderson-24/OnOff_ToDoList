import { Injectable, signal, computed } from '@angular/core';
import { ILoginResponse } from '../../interfaces/auth/auth.interface';
import { Router } from '@angular/router';

export type UserInfo = Pick<ILoginResponse, 'fullName' | 'email'>;

@Injectable({ providedIn: 'root' })
export class AppStateService {
  // UI
  readonly sidebarOpen = signal(false);
  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }
  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  // Session
  readonly user = signal<UserInfo | null>(null);
  readonly isLogged = computed(() => !!localStorage.getItem('token'));

  public setUserFromLogin(res: ILoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem(
      'user',
      JSON.stringify({ fullName: res.fullName, email: res.email })
    );
    this.user.set({ fullName: res.fullName, email: res.email });
  }

  public loadFromStorage() {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        this.user.set(JSON.parse(raw) as UserInfo);
      } catch {
        this.user.set(null);
      }
    }
  }

  public clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);

  }
}
