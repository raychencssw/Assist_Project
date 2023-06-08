import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EventServiceService {
    events: any = []
  
    constructor(private http: HttpClient, private router: Router) { }
  
    addtoEvents(event: any){
      console.log("event: " + JSON.stringify(event));
      //event: {"name":"Great event","date":"Great Day","time":"Great Time","location":"Great Locale","description":"Have fun"}
      
      //1st parameter: the entrypoint defined in server.js
      //2nd parameter: the body to be sent to the backend
      //http.post makes a POST request to the backend and returns an Obervable that represents the ongoing HTTP request and allows you to handle the response asynchronously
      //.subscribe observes any changes it subscribe to and specify what should happen when the response is received
      //http.get returns Observable, yet it returns subscription after .subscribe
      return this.http.post(`http://localhost:3080/createevent`, event).subscribe(()=>{
        this.router.navigate(['/events']);  //redirect the user back to their events page
      })
    }


    loadEvent (){        
        return this.http.get(`http://localhost:3080/events`)
    }
    
  }