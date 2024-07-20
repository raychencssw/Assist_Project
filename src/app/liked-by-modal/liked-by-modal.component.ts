import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private profileService: ProfileService,
              private auth: AuthService,
              private router: Router,
              public activeModal: NgbActiveModal
  ){}

  ngOnInit(){
    this.getProfilePicture();
  }

  getProfilePicture(){
    console.log(this.post);
    const currentUser = this.auth.findUser();
    this.likedByUsers = this.post.likedBy.filter( (user:User) =>{ 
      return user.id != currentUser.id
    });
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

  viewProfile(userId: string) {
    this.activeModal.close();
    this.router.navigate(['/profile', userId]);
  }
}

export interface User {
  id:string;
  username: string;
  _id: string;
  profilePicture: string;
}
