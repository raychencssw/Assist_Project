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
}
