import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

type JwtPart = Record<string, unknown>;
type ClaimChange = { claim: string; before: string; after: string };

@Component({
  selector: 'app-jwt-inspector',
  templateUrl: './jwt-inspector.component.html',
  styleUrl: './jwt-inspector.component.scss',
})
export class JwtInspectorComponent {
  private readonly auth = inject(AuthService);
  protected readonly tampered = this.auth.tampered;
  protected readonly header = computed(() => this.decode(this.auth.token(), 0));
  protected readonly payload = computed(() => this.decode(this.auth.token(), 1));
  protected readonly changes = computed<ClaimChange[]>(() => this.findChanges(
    this.decode(this.auth.originalToken(), 1), this.payload(),
  ));

  protected format(value: JwtPart): string { return JSON.stringify(value, null, 2); }

  private decode(token: string, partIndex: number): JwtPart {
    try {
      const part = token.split('.')[partIndex];
      if (!part) return {};
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), character => character.charCodeAt(0))));
    } catch { return {}; }
  }

  private findChanges(before: JwtPart, after: JwtPart): ClaimChange[] {
    if (!this.tampered()) return [];
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .filter(claim => JSON.stringify(before[claim]) !== JSON.stringify(after[claim]))
      .map(claim => ({ claim, before: JSON.stringify(before[claim]), after: JSON.stringify(after[claim]) }));
  }
}
