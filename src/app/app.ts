import { Component, inject } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ItemManagerComponent } from './components/item-manager/item-manager.component';
import { JwtInspectorComponent } from './components/jwt-inspector/jwt-inspector.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [LoginFormComponent, ItemManagerComponent, JwtInspectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
}
