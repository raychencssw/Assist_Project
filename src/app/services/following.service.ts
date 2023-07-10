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


  getFollowers() {
    const currentUser = this.auth.findUser()

    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    this.http.get<any>(`http://localhost:3080/following/${currentUser.id}`, requestOptions).subscribe((response) => {
      this.follow = response['following']
      //console.log(this.follow)
      this.sendFollowing.next(this.follow)
    })

  }

  followButton(myid: string, userid: string, isFollowing: boolean) {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    var url = `http://localhost:3080/follow/${myid}/${userid}/${isFollowing}`
    this.http.post<any>(url, requestOptions).subscribe()
  }

  checkMyfollowing(id: string) {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    var url = `http://localhost:3080/following/${id}`
    return this.http.get<any>(url, requestOptions)
  }
  getFollowing() {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = {headers : headers};
    
  }

}
