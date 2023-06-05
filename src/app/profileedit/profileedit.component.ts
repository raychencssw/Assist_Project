import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.css']
})


export class ProfileeditComponent implements OnInit {

  username: string[] = [];
  name: string | undefined;
  firstname: string[] = [];
  lastname: string[] = [];
  email: string[] = [];
  selectedOption!: string;
  inputData: string[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,) { }


  onSubmit(myForm: NgForm) {
    console.log("this is input", myForm.value)
  }

  ngOnInit(): void { }
}

