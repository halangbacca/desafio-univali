import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemListComponent } from './item-list/item-list.component';

const routes: Routes = [
  {
    path: '',
    title: 'Cadastrar Item',
    component: LayoutComponent,
    children: [
      { path: '', component: ItemFormComponent },
      { path: 'listar', component: ItemListComponent },
      { path: 'editar/:id', component: ItemFormComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemRoutingModule {}
