import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventServiceService {
    events: any = [];
  
    constructor(private http: HttpClient, private router: Router) { }
  
    addtoEvents(event: any):Observable<any>{
      console.log("event: " + JSON.stringify(event));
      //why imageurl is {} ????
      //event: {"name":"Cheez-it, Choose it","imageurl":{},"date":"6/23/2023","time":{"hour":13,"minute":30},
      //"location":{"street":"100 Citadel Dr","city":"Commerce","state":"CA"},"description":"Life is full of 
      //opportunity and choices. Choose whatever you want to help others. You choose it, and we give you Cheez-it!"}
      
      //1st parameter: the entrypoint defined in server.js
      //2nd parameter: the body to be sent to the backend
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