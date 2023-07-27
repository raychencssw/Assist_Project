import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FollowingService } from 'src/app/services/following.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit{
  follow:any = []
  constructor(private http:HttpClient, private following: FollowingService){}

  ngOnInit(): void {
    this.following.following$.subscribe((response)=>{
      this.follow = response
      console.log(this.follow)
    })
    this.following.getFollowing()
  }

}