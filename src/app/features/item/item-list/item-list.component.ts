import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from 'src/app/shared/services/item/item.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  items: any[] = [];

  constructor(
    private itemService: ItemService,
    private notificationService: NotificationService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems();
  }

  onEdit(id: number) {
    this.router.navigate(['/item/editar', id]);
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.deleteItem(id);
        this.notificationService.openSnackBar('Produto deletado com sucesso!');
        this.items = this.itemService.getItems(); // Atualiza a lista após deletar
      }
    });
  }

  onAdd() {
    this.router.navigate(['/item']);
  }
}
