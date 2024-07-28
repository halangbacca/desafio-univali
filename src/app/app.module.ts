import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';

import { CustomMaterialModule } from './core/custom-material/custom-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { ConfirmDialogComponent } from './features/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [AppComponent, ConfirmDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [CustomMaterialModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
