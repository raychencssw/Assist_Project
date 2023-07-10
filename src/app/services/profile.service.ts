import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileResponse = new Subject<any>()

  token: any
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { 
    this.auth.authResponse.subscribe((response)=>{
      this.token = response
    })
  }

  getProfile(id:string){
    this.router.navigate([`/profile/${id}`])
  }
  updateUser(formData: any, callback: (response: any) => void){
    const user = this.auth.findUser()
    const id = user['id']
    console.log(id)
    this.http.post(`http://localhost:3080/profileedit/${id}`, formData).subscribe(response=>{
      console.log(response)
      callback(response)
    })
  }

  getUserProfile(id: string) {
    this.token = this.auth.getAuthToken()
    var backendUrl = 'http://localhost:3080/profile/' + id;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    this.http.get(backendUrl, requestOptions).subscribe((response)=>{
      console.log(response)
      this.profileResponse.next(response)
    })
  }
  // editUserProfile(id: string, username: string, formData: any) {
  //   this.token = this.auth.getAuthToken()
  //   var backendUrl = 'http://localhost:3080/profileedit/' + id;
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.token}`
  //   });

  //   const requestOptions = { headers: headers };
  //   return this.http.post(backendUrl, formData, requestOptions);

  // }

}
