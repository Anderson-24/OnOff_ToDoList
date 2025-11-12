import { Component, ViewChild } from '@angular/core';
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
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @ViewChild('dt') dt!: Table;

  // Tabla
  tasks: ITask[] = [];
  totalRecords = 0;
  loading = false;
  rows = 10;
  sortField = 'createdAt';
  sortOrder: 1 | -1 = -1;

  // Reactive form de filtros
  filterForm!: FormGroup;

  constructor(private taskService: TaskService, private fb: FormBuilder) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      userName: [''], // filtro por columna Usuario
      email: [''], // filtro por columna Correo
      title: [''], // filtro por columna Título
      globalUser: [''], // buscador superior (nombre de usuario)
    });

    // Carga inicial
    this.loadLazy({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    } as TableLazyLoadEvent);
  }

  public loadLazy(event: TableLazyLoadEvent) {
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
        },
        error: () => {
          this.tasks = [];
          this.totalRecords = 0;
        },
      });
  }

  applyFilters() {
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
}
