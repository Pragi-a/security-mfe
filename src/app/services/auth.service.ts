import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/security.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly token = signal('');
  readonly originalToken = signal('');
  readonly permissions = signal<string[]>([]);
  readonly tampered = signal(false);

  login(username: string, password: string, permissions: string[]): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:5101/api/auth/login', { username, password, permissions })
      .pipe(tap((response) => {
        this.token.set(response.access_token);
        this.originalToken.set(response.access_token);
        this.permissions.set(response.user.permissions);
        this.tampered.set(false);
      }));
  }

  tamperToken(): void {
    const token = this.token();
    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) return;

    // Change a readable payload claim but retain the original signature.
    // The JWT remains well-formed, while RS256 verification must now fail.
    const payload = this.decodeJson(tokenParts[1]);
    if (!payload) return;

    payload['sub'] = 'mallory.tampered';
    tokenParts[1] = this.encodeJson(payload);
    this.token.set(tokenParts.join('.'));
    this.tampered.set(true);
  }

  logout(): void {
    this.token.set('');
    this.originalToken.set('');
    this.permissions.set([]);
    this.tampered.set(false);
  }

  private decodeJson(value: string): Record<string, unknown> | null {
    try {
      const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), character => character.charCodeAt(0))));
    } catch {
      return null;
    }
  }

  private encodeJson(value: Record<string, unknown>): string {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
