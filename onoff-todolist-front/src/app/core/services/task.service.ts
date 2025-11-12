import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ITask } from '../interfaces/task.interface';
import { IPagedResponse } from '../interfaces/paged-response.interface';
import { TaskQuery } from '../interfaces/task-query.interface';

import { ApplicationConfigService } from './config/application-config.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  public getTasksLazy(q: TaskQuery): Observable<IPagedResponse<ITask>> {
    let params = new HttpParams().set('page', q.page).set('size', q.size);

    if (q.sortField) params = params.set('sortField', q.sortField);
    if (typeof q.sortOrder !== 'undefined')
      params = params.set('sortOrder', String(q.sortOrder));

    if (q.userName) params = params.set('userName', q.userName);
    if (q.email) params = params.set('email', q.email);
    if (q.title) params = params.set('title', q.title);
    if (q.globalUser) params = params.set('globalUser', q.globalUser);

    return this.http.get<IPagedResponse<ITask>>(
      this.applicationConfigService.getEndpointPrefix('Tasks/paged'),
      {
        params,
      }
    );
  }
}
