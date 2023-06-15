import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
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
    this.authService.loginUser(this.user)
  }
}