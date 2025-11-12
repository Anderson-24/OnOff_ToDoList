import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { AppStateService } from '../../../core/services/state/app-state.service';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';

@Component({
  selector: 'app-base-layout',
  imports: [CommonModule, TopBarComponent, SideNavComponent, RouterOutlet],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent {
  constructor(public app: AppStateService, private router: Router) {
    this.app.loadFromStorage();
    effect(() => {
      const token = localStorage.getItem('token');
      if (!token) this.router.navigateByUrl('/login');
    });
  }
}
