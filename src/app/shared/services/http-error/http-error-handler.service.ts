import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(
    private _snackBar: MatSnackBar
  ) {}

  public handleError = (error: HttpErrorResponse) => {

    if(error.name?.includes('HttpErrorResponse')){
      this._snackBar.open(error.error?.message,'X')}
    }

}

