import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-liked-by-modal',
  templateUrl: './liked-by-modal.component.html',
  styleUrls: ['./liked-by-modal.component.css']
})
export class LikedByModalComponent implements OnInit{

  @Input() post:any;      // make this component able to get input from other component
  // likedByUsers: User [] = [];
  // likedByInfo: User [] = [];

  likedByUsers: any = [];
  likedByInfo: any = [];

  constructor(private profileService: ProfileService){}

  ngOnInit(){
    this.getProfilePicture();
  }

  getProfilePicture(){
    console.log(this.post);
    this.likedByUsers = this.post.likedBy.slice(1);
    console.log(this.likedByUsers);

    this.profileService.profileResponse.subscribe( user => {
      console.log(user);
      this.likedByInfo.push(user);
    })

    for(let i = 0; i < this.likedByUsers.length; i ++){
      let user = this.likedByUsers[i];
      this.profileService.getUserProfile(user.id)
    }
    
    console.log(this.likedByInfo);
  }
}

export interface User {
  id:string;
  username: string;
  _id: string;
  profilePicture: string;
}
