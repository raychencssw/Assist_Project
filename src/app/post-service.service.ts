import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  posts: any = []
  postsResponse = new Subject<any>()

  constructor(private http: HttpClient, private router: Router) { }

  addtoPosts(formData: any){
    return this.http.post(`http://localhost:3080/posts/submit`, formData).subscribe(()=>{
      this.loadPosts()
      this.router.navigate(['/'])

    })
  }

  loadPosts(){
    console.log("here")
    this.http.get(`http://localhost:3080/home`).subscribe((response)=>{
      this.postsResponse.next(response)
    })
  }
}
