import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  selectedFile: File | null = null
  fileExtension: any = ""
  fileName: any = ""
  isWrongExtension: boolean = false
  registerForm!: FormGroup;
  formData: any;
  submitted = false;

  unamePattern = '^[A-Za-z0-9_]+$'

  schools: string[] = ['Los Al', 'Valley Christian', 'Orangewood Academy', 'King Drew', 'Leuzinger',
    'Poly High', 'Carson', 'Rancho Dominguez', 'South East Gate', 'Washington Prep', 'Da Vinci Schools', 'Not above'];

  user: {
    [key: string]: string;
  } = {
      email: '',
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      school: '',
      //role: '',
    };

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      school: ['', Validators.required],
      //role: ['', Validators.required],
    });
  }

  ngOnInit() { }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('The form is invalid')
      return;
    }
    else {
      Object.entries(this.registerForm.controls).forEach(([key, control]) => {
        this.user[key] = control.value
      });

      if (this.isWrongExtension) {
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
      console.log(this.formData)
      this.http.post(url, this.formData)
        .subscribe(
          (response) => {
            console.log(response); // Handle the response from the server
            this.router.navigate(['/login'])
          },
          (error) => {
            if (error.status == 409) {
              console.log("Username or Email already exists")
              alert("Username or Email already exists")
            }
            else if (error.status == 200) {
              alert("You have been signed up.")
            }
            else if (error.status == 401) {
              alert("HttpErrorResponse: No token provided")
            }
            console.error("There is an error ", error.status, error); // Handle any error that occurs during the request
            this.router.navigate(['/signup'])
          }
        )
        ;
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] as File
    this.fileName = this.selectedFile.name
    this.fileExtension = this.fileName.split('.').pop()
    if (this.fileExtension !== 'jpeg' && this.fileExtension !== 'jpg' && this.fileExtension !== 'png') {
      this.isWrongExtension = true
    } else {
      this.isWrongExtension = false
    }
  }

}