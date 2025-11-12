import { PrimeIcons } from 'primeng/api';

export enum NgColor {
  success = 'success',
  info = 'info',
  warn = 'warn',
  danger = 'danger',
  help = 'help',
  primary = 'primary',
  secondary = 'secondary',
  contrast = 'contrast',
}

export interface Message {
  type?: 'dialog' | 'toast';
  title?: string;
  titleClass?: string;
  message?: string;
  severity?: NgColor;
  secondaryMessage?: string;
  textBtnConfirm?: string;
  textBtnCancel?: string;
  icon?: PrimeIcons | string;
  iconToast?: string;
  showAlert: boolean;
  width?: string;
  closeHandler?: boolean;
  colorBtnConfirm?: NgColor | null | undefined;
  colorBtnCancel?: NgColor | null | undefined;
  life?: number;
}
