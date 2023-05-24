import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PostServiceService } from '../post-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  postForm: FormGroup;

  constructor(private postservice: PostServiceService){
    this.postForm = new FormGroup({
      'posttext': new FormControl('')
    })
  }
  ngOnInit(): void {
    
  }

  onSubmit(){
    this.postservice.addtoPosts(this.postForm.value.posttext)
  }
}
