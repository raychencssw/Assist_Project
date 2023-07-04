import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventServiceService {
    events: any = []
    token: any
  
    constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }
  
    addtoEvents(event: any):Observable<any>{
      const sub = this.auth.getUser().subscribe((response: any)=>{
        this.token = response['token']
      })
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token }`
      });
      const requestOptions = { headers: headers };
      console.log("event: " + JSON.stringify(event));
      //event: {"Event":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
      
      //http.post makes a POST request to the backend and returns an Obervable that represents the ongoing HTTP request and allows you to handle the response asynchronously
      //.subscribe observes any changes it subscribe to and specify what should happen when the response is received
      //http.get returns Observable, yet it returns subscription after .subscribe
      console.log("addEvents!")
      return this.http.post(`http://localhost:3080/createevent`, event);
    }

    loadEvent(){        
      console.log("loadEvent!")
      return this.http.get(`http://localhost:3080/events`);
    }

    getEventById(eventId: string): Observable<any> {
      return this.http.get(`http://localhost:3080/event/${eventId}`);
    }
    
}