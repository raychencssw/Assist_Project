import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventServiceService {
  events: any = []
  token: any
  eventid: string = '';
  event: any;
  userid: string = '';
  attending: any = [];
  users: any;
  isRegistered!: boolean;
  attendees: any = []; //as ids
  attendingJson: any = [];
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  addtoEvents(event: any): Observable<any> {
    const sub = this.auth.getUser().subscribe((response: any) => {
      this.token = response['token']
    })
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
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

  loadEvent() {
    console.log("loadEvent!")
    return this.http.get(`http://localhost:3080/events`);
  }

  getEventById(eventId: string): Observable<any> {
    // return this.http.get(`http://localhost:3080/event/${eventId}`).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     // Handle the error here
    //     console.error('An error occurred:', error);
    //     // Return the error as part of the Observable stream
    //     return throwError(()=>error);
    //   })
    // );
    return this.http.get(`http://localhost:3080/event/${eventId}`);
  }

  attendEventById(eventid: string, userid: string, state: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.post(`http://localhost:3080/attendevent/${eventid}/${userid}/${state}`, requestOptions)
  }


  superviseEventById(eventid: any, userid: string, state: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.post(`http://localhost:3080/superviseevent/${eventid}/${userid}/${state}`, requestOptions)
  }

  geteventsupervised(userid: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    this.http.get(`http://localhost:3080/eventsupervised/${userid}`, requestOptions).subscribe(
      (supervised_events) => {
        // Handle the response data, for example:
        localStorage.setItem('supervisedEvents', JSON.stringify(supervised_events))
      },
      (error) => {
        console.error(error);
      }

    )

  }


  setAttending(eventid: string) {
    localStorage.setItem('eventsAttended', JSON.stringify(eventid));
  }

  async version_getListOfUsernames(userIds: string[]): Promise<void> {
    const url = 'http://localhost:3080/getUsernames'; // Replace this URL with your backend endpoint
    this.http.post<string[]>(url, { userIds }).subscribe(
      (usernames: string[]) => {
        // 'usernames' contains the list of usernames received from the backend
        const users = JSON.stringify(usernames)
        this.users = users
      }

    );
  }


  async getListOfUsernames(userIds: string[]): Promise<string> {
    try {
      const url = 'http://localhost:3080/getUsernames'; // Replace with your backend endpoint
      const userpair: any = await this.http.post<any>(url, { userIds }).toPromise();
      this.users = userpair;

    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
    return this.users
  }

}

