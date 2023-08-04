import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SocketioService } from './services/socketio.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'assist-project';
  isLoggedIn: boolean = false

  constructor(private auth: AuthService, private socketService: SocketioService){}

  ngOnInit(): void {
    this.auth.loginResponse.subscribe((response)=>{
      this.isLoggedIn = response
    })
    
  }
  ngOnDestroy() {
  this.socketService.disconnect();
}
}
