import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  selectedFile: File | null = null
  fileExtension: any = ""
  fileName: any = ""
  isWrongExtension: boolean = false
  formData: any

  user = {
    email: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    school: '',
    role: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if(this.isWrongExtension) {
      console.error("Incorrect file extension");
      this.router.navigate(['/signup']);
      return;
    }
    this.formData = new FormData();
    // Append the user data to the form data
    for (const key in this.user) {
      if (Object.prototype.hasOwnProperty.call(this.user, key)) {
        this.formData.append(key, (this.user as any)[key]);
      }
    }
    if (this.selectedFile) {
      this.formData.append('profilePicture', this.selectedFile);
    }
    const url = 'http://localhost:3080/signup';
    this.http.post(url, this.formData)
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

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] as File
    this.fileName = this.selectedFile.name
    this.fileExtension = this.fileName.split('.').pop()
    if(this.fileExtension !== 'jpeg' && this.fileExtension !== 'jpg' && this.fileExtension !== 'png'){
      this.isWrongExtension = true
    }else{
      this.isWrongExtension = false
    }
  }
}