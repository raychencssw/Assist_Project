import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = []; // Define a private property to store the user object
  private isLoggedIn = false;
  private token = ""
  loginResponse = new Subject<any>()
  authResponse = new Subject<any>()

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedIn = this.checkAuthenticationStatus();
   }


  loginUser(userDetails: any): Promise<boolean>{
    // Define the endpoint URL
    const url = 'http://localhost:3080/login';
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        // Send the POST request
        this.http.post(url, userDetails).subscribe({
        next: (response) => {
        // Stores the user object in auth service
          this.user = response;
          console.log(this.user)
          this.router.navigate(['/home']);
          this.setAuthToken(this.user['token']);
          this.isLoggedIn = true
          this.loginResponse.next(true);
      },
      error: (error) => {
        // Handle any errors
        console.error(error);
        this.router.navigate(['/login']);
      }

      });
      resolve(true)
      }, 1000)
    })

  }


  setUser(user: any): void {
    this.user = user; // Set the user object received from the backend
  }
  private setAuthToken(token: string): void {
    localStorage.setItem(this.user['token'], token);
    console.log(localStorage)
  }
  private getAuthToken(): string | null {
    return localStorage.getItem(this.user['token']);
  }
  private clearAuthToken(): void {
    localStorage.removeItem(this.user['token']);
  }
  checkAuthenticationStatus(): boolean {
    const authToken = this.getAuthToken();
    return !!authToken; // Convert the token to a boolean value
  }

  getUser(): Observable<any> {
    return of(this.user); // Retrieve the stored user object
  }

  clearUser(): void {
    this.user = null; // Clear the user object
  }
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  isLoggedInUser(){
    return this.user
  }  



  logout(): void {
    this.http.get(`http://localhost:3080/logout`).subscribe((response)=>{
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.user = null
      this.clearAuthToken();
      this.loginResponse.next(false)
    })

  }
}