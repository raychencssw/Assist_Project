import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class SearchServiceService {
  private usersearch = 'http://localhost:3080/usersearch';
  private eventsearch = 'http://localhost:3080/eventsearch';
  private searchusers = "http://localhost:3080/searchuser/"
  private searchevents = "http://localhost:3080/searchevent/"
  token: any;
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
    this.auth.authResponse.subscribe((response) => {
      this.token = response
    })
  }
  fetchAutocompleteData1(value: string): Observable<string[]> {
    return this.http.get<string[]>(this.usersearch).pipe(
      map(response =>
        response
          .map(item => item.toString())
          .filter(result => result.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10)
      )
    );
  }
  fetchAutocompleteData2(value: string): Observable<string[]> {
    return this.http.get<string[]>(this.eventsearch).pipe(
      map(response =>
        response
          .map(item => item.toString())
          .filter(result => result.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10)
      )
    );
  }
  searchuser(username: string): Observable<string[]> {
    return this.http.get<string[]>(this.searchusers + username).pipe(
      debounceTime(300) // Add debounceTime operator with the desired delay
    );

  }
  searchevent(id: string): Observable<string[]> {
    return this.http.get<string[]>(this.searchevents + id).pipe(
      debounceTime(300) // Add debounceTime operator with the desired delay
    );

  }

  searchevent(eventname: string): Observable<any>{
    return this.http.get(this.searchevents + eventname).pipe(
      debounceTime(300)
    )
  }

}
