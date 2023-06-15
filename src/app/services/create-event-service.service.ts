// import { Injectable } from '@angular/core';
// <<<<<<<< HEAD:src/app/services/create-event-service.service.ts
// import { Subject } from "rxjs";
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
// ========
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// >>>>>>>> origin/branch-ray:src/app/event-service.service.ts

// @Injectable({
//   providedIn: 'root'
// })

// export class EventServiceService {
//     events: any = []
//     token: any
  
//     constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }
  
//     addtoEvents(event: any){
//       const sub = this.auth.getUser().subscribe((response: any)=>{
//         this.token = response['token']
//       })
//       const headers = new HttpHeaders({
//         'Authorization': `Bearer ${this.token }`
//       });
//       const requestOptions = { headers: headers };
//       console.log("event: " + JSON.stringify(event));
// <<<<<<<< HEAD:src/app/services/create-event-service.service.ts
//       //event: {"Event":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
//       return this.http.post(`http://localhost:3080/createevent`, event, requestOptions).subscribe(()=>{
// ========
//       //event: {"name":"Great event","date":"Great Day","time":"Great Time","location":"Great Locale","description":"Have fun"}
      
//       //1st parameter: the entrypoint defined in server.js
//       //2nd parameter: the body to be sent to the backend
//       //http.post makes a POST request to the backend and returns an Obervable that represents the ongoing HTTP request and allows you to handle the response asynchronously
//       //.subscribe observes any changes it subscribe to and specify what should happen when the response is received
//       //http.get returns Observable, yet it returns subscription after .subscribe
//       return this.http.post(`http://localhost:3080/createevent`, event).subscribe(()=>{
// >>>>>>>> origin/branch-ray:src/app/event-service.service.ts
//         this.router.navigate(['/events']);  //redirect the user back to their events page
//       })
//     }


//     loadEvent(){        
//         return this.http.get(`http://localhost:3080/events`)
//     }

//     getEventById(eventId: string): Observable<any> {
//       return this.http.get(`http://localhost:3080/event/${eventId}`);
//     }
    
//   }