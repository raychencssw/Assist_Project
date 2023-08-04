import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from "rxjs";
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  follow: any = []
  userProfileFollower: any = []
  sendProfileFollower = new BehaviorSubject<any[]>([])
  public profileFollower$ = this.sendProfileFollower.asObservable()
  token: any
  sendFollowing = new BehaviorSubject<any[]>([])
  public following$ = this.sendFollowing.asObservable()
  constructor(private http: HttpClient, private auth: AuthService) { }


  getFollowing() {
    const currentUser = this.auth.findUser()

    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    this.http.get<any>(`http://localhost:3080/following/${currentUser.id}`, requestOptions).subscribe((response) => {
      this.follow = response['following']
      console.log(this.follow)
      this.sendFollowing.next(this.follow)
    })
  }

  getFollower(userId: string) {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = {headers : headers};
    this.http.get<any>(`http://localhost:3080/follower/${userId}`, requestOptions).subscribe((response) => {
      this.userProfileFollower = response['followers']
      this.sendProfileFollower.next(this.userProfileFollower)
    })
  }

  followButton(myid: string, userid: string, isFollowing: boolean) {
    return new Promise((resolve, reject) => {
      this.token = this.auth.getAuthToken()
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      const requestOptions = { headers: headers };
      var url = `http://localhost:3080/follow/${myid}/${userid}/${isFollowing}`
      this.http.post<any>(url, requestOptions).subscribe((response) => {
          // If the HTTP POST request is successful, resolve the Promise with the response data
          resolve(response);
        },
        (error) => {
          // If there's an error with the HTTP POST request, reject the Promise with the error
          reject(error);
        }
      );
    })
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
}