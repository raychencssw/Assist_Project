import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  posts: any = []
  postsResponse = new Subject<any>()

  constructor() { }

  addtoPosts(post: any){
    this.posts.push(post)
  }

  loadPosts(){
    console.log("here")
    this.postsResponse.next(this.posts)
  }
}
