import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

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


  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    // Define the endpoint URL
    const url = 'http://localhost:3080/login';

    // Send the POST request
    this.http.post(url, this.user).subscribe(
      (response) => {
        // Handle the successful response
        console.log(response);
        this.router.navigate(['/home'])
      },
      (error) => {
        // Handle any errors
        console.error(error);
        this.router.navigate(['/login'])
      }
    );
  }
}