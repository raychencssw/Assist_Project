import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SocketioService } from '../services/socketio.service';

interface LocationResponse {
  city: string;
  // Add other properties if necessary
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private auth: AuthService, private socketService: SocketioService){}
  ngOnInit(): void {
    // this.auth.getSocketId()
    // this.socketService.setSocketUser()
    try {
      const user = this.auth.findUser()
      this.socketService.setupSocketConnection()
      this.socketService.setsocketUser(user.id)
    } catch (error) {
      console.log("YOU ARE NOT AUTHENTICATED")
    }

  }



}
