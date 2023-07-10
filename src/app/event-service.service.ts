import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventServiceService {
  events: any = []
  token: any

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  addtoEvents(event: any) {
    const sub = this.auth.getUser().subscribe((response: any) => {
      this.token = response['token']
    })
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    console.log("event: " + JSON.stringify(event));
    //event: {"Event":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
    return this.http.post(`http://localhost:3080/createevent`, event, requestOptions).subscribe(() => {
      this.router.navigate(['/events']);  //redirect the user back to their events page
    },
      (error) => {
        if (error.status == 409) {
          alert("Event name already exists")
        }
        else if (error.status == 401) {
          alert("HttpErrorResponse: No token provided")
        }
      })


  }

  loadEvent() {
    console.log("loadEvent!")
    return this.http.get(`http://localhost:3080/events`);
  }


  getEventById(eventId: string): Observable<any> {
    return this.http.get(`http://localhost:3080/event/${eventId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error('An error occurred:', error);
        // Return the error as part of the Observable stream
        return throwError(() => error);
      })
    );
  }

}