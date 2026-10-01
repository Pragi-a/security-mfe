import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

type Permission = 'read' | 'add' | 'update' | 'delete';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private readonly auth = inject(AuthService);
  readonly authenticated = output<void>();
  protected username = 'John Doe';
  protected password = '123456';
  protected readonly permissionOptions: Permission[] = ['read', 'add', 'update', 'delete'];
  protected readonly selected: Record<Permission, boolean> = { read: true, add: true, update: true, delete: true };
  protected readonly message = signal('Use the demo account to request an RS256 token.');
  protected readonly failed = signal(false);

  protected login(): void {
    this.message.set('Requesting token from Identity Service...');
    this.failed.set(false);
    const permissions = this.permissionOptions.filter((permission) => this.selected[permission]);
    this.auth.login(this.username, this.password, permissions).subscribe({
      next: (response) => {
        this.message.set(`Signed in as ${response.user.name}.`);
        this.authenticated.emit();
      },
      error: () => {
        this.failed.set(true);
        this.message.set('Login failed. Use John Doe / 123456.');
      },
    });
  }
}
