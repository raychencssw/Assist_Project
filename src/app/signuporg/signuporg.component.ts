import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signuporg',
  templateUrl: './signuporg.component.html',
  styleUrls: ['./signuporg.component.css']
})
export class SignuporgComponent implements OnInit{

  isLoading: boolean = false;
  userNameError: boolean = false;
  orgNameError: boolean = false;
  emailError: boolean = false;
  registerForm!: FormGroup;
  submitted = false;


  user = {
    organization: '',
    location: '',
    username: '',
    name: '',
    email: '',
    phone:'',
    password: '',
    profilepicture: ''
  };

  get f() { return this.registerForm.controls; }

  constructor(private formBuilder: FormBuilder){
    this.registerForm = this.formBuilder.group({
      organization: ['', Validators.required],
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      school: ['', Validators.required],
    });
  }
  ngOnInit() { }
  onSubmit() {}

  onFileChange(event: any){

  }
}
