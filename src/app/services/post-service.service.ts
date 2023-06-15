import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class PostServiceService implements OnInit{
  posts: any = []
  postsResponse = new Subject<any>()
  token: any
  private subscription?: Subscription

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    const sub = this.auth.getUser().subscribe((response: any)=>{
      this.token = response['token']
    })
  }

  addtoPosts(formData: any){
    this.subscription = this.auth.getUser().subscribe((response: any)=>{
      this.token = response['token']
    })
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    this.http.post(`http://localhost:3080/posts/submit`, formData, requestOptions).subscribe(()=>{
      // this.loadPosts()
      // this.router.navigate(['/home'])
      window.location.reload()

    })
  }

  loadPosts(pageNumber: Number){
    const sub = this.auth.getUser().subscribe((response: any)=>{
      this.token = response['token']
    })
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    this.http.get(`http://localhost:3080/home/${pageNumber}`, requestOptions).subscribe((response)=>{
      console.log(response)
      this.postsResponse.next(response)
    })
  }
}
