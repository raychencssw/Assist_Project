import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    email: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    school: '',
    role: '',
    profilepicture: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const url = 'http://localhost:3080/signup';
    this.http.post(url, this.user)
      .subscribe(
        (response) => {
          console.log(response); // Handle the response from the server
          this.router.navigate(['/login'])
        },
        (error) => {
          console.error(error); // Handle any error that occurs during the request
          this.router.navigate(['/signup'])
        }
      );
  }
}