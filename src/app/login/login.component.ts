import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Define the request body
  user = {
    email: '',
    password: ''
  };


  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }
  onSubmit() {
    if (!this.validateEmail(this.user.email)) {
      alert('Please enter a valid email address');
      return;
    }
    this.authService.loginUser(this.user)

  }

  private validateEmail(email: string): boolean {
    // Email validation
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    return emailPattern.test(email);
  }



}