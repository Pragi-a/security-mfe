import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/security.models';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({ selector: 'app-item-manager', imports: [FormsModule], templateUrl: './item-manager.component.html', styleUrl: './item-manager.component.scss' })
export class ItemManagerComponent implements OnInit {
  private readonly itemsApi = inject(ItemsService);
  private readonly auth = inject(AuthService);
  protected readonly permissions = this.auth.permissions;
  protected readonly tokenTampered = this.auth.tampered;
  protected itemName = '';
  protected readonly items = signal<Item[]>([]);
  protected readonly selectedId = signal<number | null>(null);
  protected readonly message = signal('');
  protected readonly failed = signal(false);
  ngOnInit(): void { this.load(); }
  protected add(): void { this.itemsApi.add({ name: this.itemName }).subscribe({ next: () => { this.itemName = ''; this.success('Item added.'); this.load(); }, error: e => this.error(e.error?.message ?? 'Could not add item.') }); }
  protected update(): void { const id = this.selectedId(); if (id === null) return this.error('Select an item to update.'); this.itemsApi.update(id, { name: this.itemName }).subscribe({ next: () => { this.success('Item updated.'); this.load(); }, error: e => this.error(e.error?.message ?? 'Could not update item.') }); }
  protected remove(): void { const id = this.selectedId(); if (id === null) return this.error('Select an item to remove.'); this.itemsApi.remove(id).subscribe({ next: () => { this.itemName = ''; this.selectedId.set(null); this.success('Item removed.'); this.load(); }, error: () => this.error('Could not remove item.') }); }
  protected select(item: Item): void { this.selectedId.set(item.id); this.itemName = item.name; this.success(`Selected “${item.name}”.`); }
  protected logout(): void { this.auth.logout(); }
  protected tamperToken(): void {
    this.auth.tamperToken();
    this.error('JWT signature has been tampered with. The next protected request should return 401 Unauthorized.');
  }
  protected can(permission: string): boolean { return this.permissions().includes(permission); }
  private load(): void { this.itemsApi.getAll().subscribe({ next: items => this.items.set(items), error: () => this.error('Could not load protected items.') }); }
  private success(message: string): void { this.failed.set(false); this.message.set(message); }
  private error(message: string): void { this.failed.set(true); this.message.set(message); }
}
