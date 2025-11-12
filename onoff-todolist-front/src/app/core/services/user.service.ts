import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from './config/application-config.service';
import { IUser } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  public getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      this.applicationConfigService.getEndpointPrefix('Users')
    );
  }
}
