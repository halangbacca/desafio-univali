import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private storageKey = 'items';

  constructor() {}

  getItems() {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  getItem(id: number) {
    const items = this.getItems();
    return items.find((item: any) => item.id === id);
  }

  addItem(item: any) {
    const items = this.getItems();
    item.id = new Date().getTime();
    items.push(item);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  updateItem(updatedItem: any) {
    const items = this.getItems();
    const index = items.findIndex((item: any) => item.id === updatedItem.id);
    if (index > -1) {
      items[index] = updatedItem;
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  deleteItem(id: number) {
    let items = this.getItems();
    items = items.filter((item: any) => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
