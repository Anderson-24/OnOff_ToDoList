import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginRequest,
  ILoginResponse,
} from '../../interfaces/auth/auth.interface';
import { Observable, tap } from 'rxjs';
import { ApplicationConfigService } from '../config/application-config.service';
import { AppStateService } from '../state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private appState: AppStateService
  ) {}

  public login(data: ILoginRequest): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(
        this.applicationConfigService.getEndpointPrefix('Auth/login'),
        data
      )
      .pipe(
        tap((res) => {
          this.appState.setUserFromLogin(res);
          // localStorage.setItem('token', res.token);
          // localStorage.setItem('user', JSON.stringify(res));
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
