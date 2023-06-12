import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileResponse = new Subject<any>()
  constructor(private http: HttpClient, private router: Router) { }

  getProfile(id:string){
    this.http.get(`http://localhost:3080/profile/${id}`).subscribe(response=>{
      this.profileResponse.next(response)
      this.router.navigate(['/profile'])
    })
  }
}
