import { Injectable, signal } from '@angular/core';
import { Message } from '../../../interfaces/message.interface';

@Injectable({ providedIn: 'root' })
export class AlertsMessagesService {
  message = signal<Message | null>(null);

  private resolveFn: ((value: boolean) => void) | null = null;

  public showAlert(newMessage: Message): Promise<boolean> {
    this.message.set(newMessage);
    if (newMessage.type === 'dialog' || !newMessage.type) {
      return new Promise<boolean>((resolve) => (this.resolveFn = resolve));
    }
    return Promise.resolve(true);
  }

  public closeAlert(response: boolean): void {
    if (this.resolveFn) {
      this.resolveFn(response);
      this.resolveFn = null;
    }
    this.message.set(null);
  }
}
