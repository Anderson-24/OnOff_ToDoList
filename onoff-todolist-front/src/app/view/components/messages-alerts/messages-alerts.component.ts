import { Component, ViewEncapsulation, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AlertsMessagesService } from '../../../core/services/utils/alerts-messages/alerts-messages.service';
import { Message } from '../../../core/interfaces/message.interface';

@Component({
  selector: 'app-messages-alerts',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './messages-alerts.component.html',
  styleUrls: ['./messages-alerts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessagesAlertsComponent {
  isToastVisible = false;

  constructor(
    private alertMessagesService: AlertsMessagesService,
    private messageService: MessageService
  ) {
    effect(() => {
      const msg = this.alertMessagesService.message();
      if (msg && msg.type === 'toast') {
        const toastDuration = msg.life ?? 5000;

        this.isToastVisible = true;
        this.messageService.add({
          severity: msg.severity,
          summary: msg.title,
          detail: msg.message,
          key: 'top-center',
          life: toastDuration,
        });

        // Limpiar para evitar repeticiones
        this.alertMessagesService.message.set(null);
        setTimeout(() => (this.isToastVisible = false), toastDuration);
      }
    });
  }

  get message(): Message {
    return this.alertMessagesService.message() || { showAlert: false };
  }

  public onDialogHide(): void {
    // opcional: logging
  }

  public close(result: boolean): void {
    this.alertMessagesService.closeAlert(result);
  }

  handleToastClose() {
    this.isToastVisible = false;
  }
}
