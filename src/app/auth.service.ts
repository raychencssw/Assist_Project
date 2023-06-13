import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null; // Define a private property to store the user object

  constructor() { }

  setUser(user: any): void {
    this.user = user; // Set the user object received from the backend
  }

  getUser(): any {
    return this.user; // Retrieve the stored user object
  }

  clearUser(): void {
    this.user = null; // Clear the user object
  }
}