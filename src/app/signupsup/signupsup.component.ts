import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signupsup',
  templateUrl: './signupsup.component.html',
  styleUrls: ['./signupsup.component.css']
})
export class SignupsupComponent implements OnInit{

  isLoading: boolean = false
  userNameError: boolean = false
  emailError: boolean = false

  registerForm!: FormGroup;
  submitted = false;

  user = {
    email: '',
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    profilepicture: ''
  };

  get f() { return this.registerForm.controls; }

  constructor(){}
  ngOnInit(){
    
  }
  onSubmit(){

  }

  onFileChange(event: any){

  }
}
