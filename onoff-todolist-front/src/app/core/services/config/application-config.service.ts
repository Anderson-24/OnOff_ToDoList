import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  private readonly base = '/api'; 

  public getEndpointPrefix(path: string): string {
    const p = path.replace(/^\/+/, '');
    return `${this.base}/${p}`;
  }
}
