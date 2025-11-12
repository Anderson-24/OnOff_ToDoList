import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { AppStateService } from '../../../core/services/state/app-state.service';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { MessagesAlertsComponent } from '../../components/messages-alerts/messages-alerts.component';
import { AlertsMessagesService } from '../../../core/services/utils/alerts-messages/alerts-messages.service';
import { NgColor } from '../../../core/interfaces/message.interface';

@Component({
  selector: 'app-base-layout',
  imports: [
    CommonModule,
    TopBarComponent,
    SideNavComponent,
    RouterOutlet,
    MessagesAlertsComponent,
  ],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent implements OnInit {
  private alerts = inject(AlertsMessagesService);

  constructor(public app: AppStateService, private router: Router) {
    this.app.loadFromStorage();
    effect(() => {
      const token = localStorage.getItem('token');
      if (!token) this.router.navigateByUrl('/login');
    });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const name = user ? JSON.parse(user)?.fullName ?? 'usuario' : 'usuario';

    this.alerts.showAlert({
      type: 'toast',
      severity: NgColor.success,
      title: '¡Bienvenido!',
      message: `Bienvenido a OnOff ToDoList, ${name}.`,
      showAlert: true,
      life: 3000,
    });
  }
}
