import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { AppStateService } from '../../../core/services/state/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, ButtonModule, AvatarModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  constructor(public app: AppStateService, private router: Router) {}

  public logout() {
    this.app.clearSession();
    this.router.navigateByUrl('/login');
  }
}
