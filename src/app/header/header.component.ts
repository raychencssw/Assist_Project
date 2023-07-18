import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isLoggedin = false
  subscription?:Subscription
  notifications: any
  showNotifications: boolean = false
  count: any = 0
  navbarCollapsed: boolean = false;
  constructor(public authservice: AuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.authservice.getUser().subscribe(response=>{
      if(response != null){
        this.isLoggedin = true
      }else{
        this.isLoggedin = false
      }
    })
    this.notifications = this.authservice.getNotifications()
    this.checkCount(this.notifications)
    console.log(this.notifications)

  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  authLogout(){
    this.authservice.logout()
  }

  checkCount(notiArray: any){
    let temp = 0
    for (let i = 0; i < notiArray.length; i++) {
      if(notiArray[i].isRead == false){
        temp++
      }
    }
    this.count = temp
    console.log("THE COUNT IS", this.count)
  }

  makeRead(id: any){
    console.log("CLIKED NOTIFICATION IS", id)
    for (let i = 0; i < this.notifications.length; i++) {
      if(this.notifications[i]._id == id){
        this.notifications[i].isRead = true
        this.authservice.setNotifications(this.notifications)
      }
      
    }
    this.checkCount(this.notifications)
    this.notificationService.readNotification(id)
  }
  toggleNavbarCollapsing(){
    this.navbarCollapsed = !this.navbarCollapsed
  }

}
