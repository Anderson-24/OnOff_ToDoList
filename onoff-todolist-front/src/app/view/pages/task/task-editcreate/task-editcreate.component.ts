import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ITask } from '../../../../core/interfaces/task.interface';
import { IUser } from '../../../../core/interfaces/user.interface';
import { IStatusTask } from '../../../../core/interfaces/status-task.interface';
import { TaskService } from '../../../../core/services/task.service';
import { AlertsMessagesService } from '../../../../core/services/utils/alerts-messages/alerts-messages.service';
import { UsersService } from '../../../../core/services/user.service';
import { StatusTasksService } from '../../../../core/services/status-tasks.service';
import { NgColor } from '../../../../core/interfaces/message.interface';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-task-editcreate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './task-editcreate.component.html',
  styleUrls: ['./task-editcreate.component.scss'],
})
export class TaskEditcreateComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: ITask | null = null;

  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  submitted = false;
  loading = signal(false);

  usersOptions = signal<IUser[]>([]);
  statusOptions = signal<IStatusTask[]>([]);

  constructor(
    private fb: FormBuilder,
    private tasksService: TaskService,
    private usersService: UsersService,
    private statusService: StatusTasksService,
    private alerts: AlertsMessagesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idUser: [null as number | null, Validators.required],
      idStatus: [null as number | null, Validators.required],
      title: ['', Validators.required],
      description: [''],
    });

    this.loadLookups();

    this.fillFormForMode(); // por si entra visible ya en true
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el modo o la tarea, ajusta el formulario
    if (changes['mode'] || changes['task']) {
      this.fillFormForMode();
    }
  }

  // Se llama cada vez que se muestra el diálogo (evento de PrimeNG)
  onShowDialog(): void {
    this.submitted = false;
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.fillFormForMode();
  }

  onHideDialog(): void {
    if (!this.loading()) {
      this.visibleChange.emit(false);
    }
  }

  private fillFormForMode(): void {
    if (!this.form) return;

    if (this.mode === 'edit' && this.task) {
      this.form.setValue({
        idUser: this.task.user && this.task.user.id ? this.task.user.id : null,
        idStatus:
          this.task.status && this.task.status.id ? this.task.status.id : null,
        title: this.task.title ?? '',
        description: this.task.description ?? '',
      });
    } else {
      this.form.reset({
        idUser: null,
        idStatus: null,
        title: '',
        description: '',
      });
    }
  }

  private loadLookups(): void {
    this.usersService.getAll().subscribe({
      next: (users) => this.usersOptions.set(users ?? []),
      error: () => this.usersOptions.set([]),
    });

    this.statusService.getAll().subscribe({
      next: (st) => this.statusOptions.set(st ?? []),
      error: () => this.statusOptions.set([]),
    });
  }

  cancel(): void {
    if (!this.loading()) {
      this.visible = false;
      this.visibleChange.emit(false);
    }
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const payload = this.form.getRawValue() as {
      idUser: number;
      idStatus: number;
      title: string;
      description?: string;
    };

    this.loading.set(true);

    const req$ =
      this.mode === 'edit' && this.task
        ? this.tasksService.update(this.task.id, payload)
        : this.tasksService.create(payload);

    req$.subscribe({
      next: () => {
        this.loading.set(false);
        this.alerts.showAlert({
          type: 'toast',
          severity: NgColor.success,
          title: '¡Hecho!',
          message:
            this.mode === 'edit' ? 'Registro actualizado.' : 'Registro creado.',
          showAlert: true,
          life: 2200,
        });
        this.saved.emit();
        this.visible = false;
        this.visibleChange.emit(false);
      },
      error: () => {
        this.loading.set(false);
        this.alerts.showAlert({
          type: 'toast',
          severity: NgColor.danger,
          title: 'Error',
          message: 'No fue posible guardar la tarea.',
          showAlert: true,
          life: 3500,
        });
      },
    });
  }
}
