import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Define the request body
  user = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient) { }

  onSubmit() {
    // Define the endpoint URL
    const url = 'http://localhost:3080/login';

    // Send the POST request
    this.http.post(url, this.user).subscribe(
      (response) => {
        // Handle the successful response
        console.log(response);
      },
      (error) => {
        // Handle any errors
        console.error(error);
      }
    );
  }
}