import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ITask } from '../../../core/interfaces/task.interface';
import { TaskService } from '../../../core/services/task.service';
import { CardModule } from 'primeng/card';
import { AlertsMessagesService } from '../../../core/services/utils/alerts-messages/alerts-messages.service';
import { NgColor } from '../../../core/interfaces/message.interface';
import { TaskEditcreateComponent } from './task-editcreate/task-editcreate.component';

@Component({
  selector: 'app-task',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    TagModule,
    ReactiveFormsModule,
    DatePipe,
    CardModule,
    TaskEditcreateComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild(TaskEditcreateComponent)
  public taskEditCreateComponent!: TaskEditcreateComponent;

  // Tabla
  tasks: ITask[] = [];
  totalRecords = 0;
  loading = false;
  rows = 10;
  sortField = 'createdAt';
  sortOrder: 1 | -1 = -1;

  filterForm!: FormGroup;
  showEditor = signal(false);
  editorMode = signal<'create' | 'edit'>('create');
  selectedTask = signal<ITask | null>(null);

  private lastLazyEvent: TableLazyLoadEvent | null = null;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private alerts: AlertsMessagesService
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      userName: [''],
      email: [''],
      title: [''],
      globalUser: [''],
    });

    this.loadLazy({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    } as TableLazyLoadEvent);
  }

  public loadLazy(event: TableLazyLoadEvent) {
    this.lastLazyEvent = event;
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? this.rows) + 1;
    const size = event.rows ?? this.rows;
    const sortField = Array.isArray(event.sortField)
      ? event.sortField[0]
      : event.sortField ?? this.sortField;
    const sortOrder = (event.sortOrder as 1 | -1) ?? this.sortOrder;

    const { userName, email, title, globalUser } = this.filterForm.value;

    this.taskService
      .getTasksLazy({
        page,
        size,
        sortField,
        sortOrder,
        userName: userName || undefined,
        email: email || undefined,
        title: title || undefined,
        globalUser: globalUser || undefined,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.tasks = res.data;
          this.totalRecords = res.total;
          this.sortField = sortField!;
          this.sortOrder = sortOrder!;

          this.alerts.showAlert({
            type: 'toast',
            severity: NgColor.success,
            title: 'Consulta exitosa',
            message: `Se cargaron ${res.data.length} registros.`,
            showAlert: true,
            life: 2500,
          });
        },
        error: () => {
          this.tasks = [];
          this.totalRecords = 0;

          this.loading = false;

          this.alerts.showAlert({
            type: 'toast',
            severity: NgColor.danger,
            title: 'Error',
            message: 'Ha ocurrido un error al consultar las tareas.',
            showAlert: true,
            life: 4000,
          });
        },
      });
  }

  public applyFilters() {
    // ir a primera página y recargar con filtros actuales
    this.dt.first = 0;
    this.loadLazy({
      first: 0,
      rows: this.dt.rows ?? this.rows,
      sortField: this.dt.sortField ?? this.sortField,
      sortOrder: (this.dt.sortOrder as 1 | -1) ?? this.sortOrder,
    } as TableLazyLoadEvent);
  }

  public clearAll() {
    this.filterForm.reset({
      userName: '',
      email: '',
      title: '',
      globalUser: '',
    });
    this.dt.reset();
  }

  public statusSeverity(
    name?: string
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    const n = (name || '').toLowerCase();
    if (n.includes('listo')) return 'success';
    if (n.includes('qa')) return 'info';
    if (n.includes('curso')) return 'warning';
    if (n.includes('bloque')) return 'danger';
    return undefined;
  }

  public onEditTask(row: ITask): void {
    this.alerts.showAlert({
      type: 'toast',
      severity: NgColor.info,
      title: 'Editar',
      message: `Abrir modal de edición para la tarea #${row.id}.`,
      showAlert: true,
      life: 1800,
    });
  }

  handleSaved() {
    this.showEditor.set(false);
    if (this.lastLazyEvent) {
      this.loadLazy(this.lastLazyEvent);
    } else {
      // fallback si no hay lazy event aún
    }
    this.taskEditCreateComponent.visible = true;
  }
  public openModal(type: 'create' | 'edit', task?: ITask) {
    this.editorMode.set(type);
    this.selectedTask.set(task ?? null);
    this.showEditor.set(true);
    this.taskEditCreateComponent.visible = true;
  }

  public async onDeleteTask(taskId: number) {
    const ok = await this.alerts.showAlert({
      type: 'dialog',
      icon: 'pi pi-exclamation-triangle',
      title: 'Eliminar tarea',
      titleClass: 'text-red-500',
      message: '¿Está seguro de eliminar esta tarea?',
      secondaryMessage: 'Esta acción es irreversible.',
      textBtnCancel: 'No, cancelar',
      textBtnConfirm: 'Sí, eliminar',
      colorBtnConfirm: NgColor.danger,
      showAlert: true,
      width: '420px',
    });

    if (!ok) return;

    this.taskService.delete(taskId).subscribe({
      next: () => {
        this.alerts.showAlert({
          type: 'toast',
          severity: NgColor.success,
          title: '¡Hecho!',
          message: 'La tarea fue eliminada correctamente.',
          showAlert: true,
        });
        this.clearAll();
      },
      error: () => {
        this.alerts.showAlert({
          type: 'toast',
          severity: NgColor.danger,
          title: 'Error',
          message: 'No fue posible eliminar la tarea.',
          showAlert: true,
        });
      },
    });
  }
}
