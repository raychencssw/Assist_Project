import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    // Define the endpoint URL
    const url = 'http://localhost:3080/login';

    // Send the POST request
    this.http.post(url, this.user).subscribe(
      (response) => {
        // Handle the successful response
        console.log(response);
        const user = response;
        // Stores the user object in auth service
        this.authService.setUser(user);
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        this.router.navigate(['/login'])
      }
    );
  }
}