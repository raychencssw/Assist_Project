import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit{
  user: any
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.findUser()
    console.log(this.user)
  }
}
