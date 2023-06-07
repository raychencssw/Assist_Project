import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    profilePicture: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    const url = 'http://localhost:3080/signup';
    this.http.post(url, this.user)
      .subscribe(
        (response) => {
          console.log(response); // Handle the response from the server
        },
        (error) => {
          console.error(error); // Handle any error that occurs during the request
        }
      );
  }
}