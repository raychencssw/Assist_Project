import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isLoggedin = false
  subscription?:Subscription
  constructor(public authservice: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authservice.getUser().subscribe(response=>{
      if(response != null){
        this.isLoggedin = true
      }
    })
  }
  authLogout(){
    this.authservice.logout()
  }


}
