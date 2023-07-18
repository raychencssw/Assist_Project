import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  token: any
  recommendResponse = new Subject<any>()
  constructor(private http: HttpClient, private auth: AuthService) { }

  getPeople(userid: any){
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    console.log("THE ID IS", userid)
    this.http.get(`http://localhost:3080/recommend/${userid}`, requestOptions).subscribe(response=>{
      this.recommendResponse.next(response)
    })
  }
}
