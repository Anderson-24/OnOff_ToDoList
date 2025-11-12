import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SidebarModule } from 'primeng/sidebar';

import { AppStateService } from '../../../core/services/state/app-state.service';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule, SidebarModule, RouterLink, RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  constructor(public app: AppStateService, private router: Router) {}

  public navigate(url: string) {
    this.router.navigateByUrl(url);
    this.app.closeSidebar();
  }
}
