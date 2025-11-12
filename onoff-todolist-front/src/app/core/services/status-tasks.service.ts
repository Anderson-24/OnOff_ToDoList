import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IStatusTask } from '../interfaces/status-task.interface';
import { ApplicationConfigService } from './config/application-config.service';

@Injectable({ providedIn: 'root' })
export class StatusTasksService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  public getAll(): Observable<IStatusTask[]> {
    return this.http.get<IStatusTask[]>(
      this.applicationConfigService.getEndpointPrefix('StatusTask')
    );
  }
}
