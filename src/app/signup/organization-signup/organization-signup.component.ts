import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//http://localhost:4200/orgsignup

@Component({
  selector: 'app-organization-signup',
  templateUrl: './organization-signup.component.html',
  styleUrls: ['./organization-signup.component.css']
})
export class OrganizationSignupComponent implements OnInit {
  selectedFile: File | null = null
  fileExtension: any = ""
  fileName: any = ""
  isWrongExtension: boolean = false
  formData: any
  isLoading: boolean = false
  nameError: boolean = false
  emailError: boolean = false

  registerForm!: FormGroup;
  submitted = false;

  unamePattern = '^[A-Za-z0-9_]+$'

  schools: string[] = ['Los Al', 'Valley Christian', 'Orangewood Academy', 'King Drew', 'Leuzinger',
    'Poly High', 'Carson', 'Rancho Dominguez', 'South East Gate', 'Washington Prep', 'Da Vinci Schools', 'Not above'];

  user = {
    email: '',
    name: '',
    password: '',
    phone: '',
    location: '',
    profilepicture: ''
  };

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],


      //role: ['', Validators.required],
    });
  }

  ngOnInit() { }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    alert("successful submission")

    if (this.isWrongExtension) {
      console.error("Incorrect file extension");
      this.router.navigate(['/orgsignup']);
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

    this.isLoading = true;
    const url = 'http://localhost:3080/orgsignup';

    this.http.post(url, this.formData)
      .subscribe({
        next: (response) => {
          console.log(response);
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
          if (error.error.message == 'name already exists') {
            this.nameError = true;
          } else if (error.error.message == 'Email already exists') { // <- Here's the issue
            this.emailError = true;
          }
        }
      });
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