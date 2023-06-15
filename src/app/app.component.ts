import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'assist-project';
  isLoggedIn: boolean = false

  constructor(private auth: AuthService){}

  ngOnInit(): void {
    this.auth.loginResponse.subscribe((response)=>{
      this.isLoggedIn = response
    })
  }
}
