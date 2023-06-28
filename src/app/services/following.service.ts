import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  follow: any = []
  token: any
  sendFollowing = new BehaviorSubject<any[]>([])
  public following$ = this.sendFollowing.asObservable()
  constructor(private http: HttpClient, private auth: AuthService) { }


  getFollowers(){
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    this.http.get<any>(`http://localhost:3080/following`, requestOptions).subscribe((response)=>{
      this.follow = response['following']
      console.log(this.follow)
      this.sendFollowing.next(this.follow)
    })
  }
}
