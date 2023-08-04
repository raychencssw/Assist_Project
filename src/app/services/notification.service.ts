import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { not } from 'joi';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  token: any
  constructor(private auth: AuthService, private http: HttpClient) { }

  readNotification(notificationid: any){
    console.log("THE NOTIFICATION ID IS", notificationid)
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    const notification = {
      id: notificationid
    }
    this.http.put<any>(`http://localhost:3080/notifications/readnotification`, notification, requestOptions).subscribe(response=>{
      console.log(response)
    })
  }
}