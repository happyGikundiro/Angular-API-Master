import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  handleError(error: any) {
    console.error('API Error:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  
}
