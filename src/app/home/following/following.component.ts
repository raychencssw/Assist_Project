import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit{
  follow:any = []
  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3080/following`).subscribe((response)=>{
      this.follow = response['following']
      console.log(this.follow)
    })
  }

}
