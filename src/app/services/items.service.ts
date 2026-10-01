import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemRequest } from '../models/security.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly url = 'http://localhost:5102/api/items';

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.url, { headers: this.headers() });
  }
  add(request: ItemRequest): Observable<Item> {
    return this.http.post<Item>(this.url, request, { headers: this.headers() });
  }
  update(id: number, request: ItemRequest): Observable<Item> {
    return this.http.put<Item>(`${this.url}/${id}`, request, { headers: this.headers() });
  }
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { headers: this.headers() });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.token()}` });
  }
}
