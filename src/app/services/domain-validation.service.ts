import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainValidationService {

  constructor() { }
  validateEmailDomain(email: any) {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) {
      return true
    } else {
      return false
    }
  }

}
