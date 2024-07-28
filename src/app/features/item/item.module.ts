import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemFormComponent } from './item-form/item-form.component';
import { CommonModule } from '@angular/common';
import { ItemRoutingModule } from './item-routing.module';
import { CustomMaterialModule } from 'src/app/core/custom-material/custom-material.module';
import { ItemListComponent } from './item-list/item-list.component';

@NgModule({
  declarations: [ItemFormComponent, ItemListComponent],
  imports: [
    CommonModule,
    ItemRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class ItemModule {}
