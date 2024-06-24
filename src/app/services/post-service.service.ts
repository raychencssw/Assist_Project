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
  postsResponse = new Subject<any>() //loadPosts() updates this Subject
  oneUserPostsResponse = new Subject<any>()
  token: any

  private subscription?: Subscription

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.token = this.auth.getAuthToken()
  }

  addtoPosts(formData: any){
    this.token = this.auth.getAuthToken()
    const user = this.auth.findUser()
    const id = user['id']
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    this.http.post(`http://localhost:3080/posts/submit/${id}`, formData, requestOptions).subscribe(()=>{
      // this.loadPosts()
      // this.router.navigate(['/home'])
      window.location.reload()

    })
  }

  loadPosts(pageNumber: Number){
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    let url = `http://localhost:3080/home/${pageNumber}`;
    this.http.get(url, requestOptions).subscribe((response)=>{
      console.log('started to load posts from server')
      console.log(response)
      console.log('posts loaded from server!')
      this.postsResponse.next(response) //pass response from the server directly to front end
    })
  }

  //6/22 move auth call to post-service
  // addRemoveLike(userid: string, postid: string, addtoLike: boolean){
  //   console.log(userid, postid, addtoLike)
  //   this.token = this.auth.getAuthToken()
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.token }`
  //   });
  //   const requestOptions = { headers: headers };
  //   const data = {
  //     userid: userid,
  //     postid: postid,
  //     addtoLike: addtoLike
  //   }
  //   this.http.post(`http://localhost:3080/posts/togglelike`, data, requestOptions).subscribe(response=>{
  //     console.log(response)
  //   })
  // }

  addRemoveLike(likedPosts: string, postid: string, addtoLike: boolean){
    const user = this.auth.findUser();
    console.log('addRemoveLike....');
    console.log('user.id: ', user.id);
    console.log('postid: ', postid);
    console.log('likedPosts: ', likedPosts);
    console.log('addtoLike: ', addtoLike);
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    const data = {
      userid: user.id,
      postid: postid,
      addtoLike: addtoLike
    }
    this.http.post(`http://localhost:3080/posts/togglelike`, data, requestOptions).subscribe(response=>{
      console.log(response)
    })
  }


  //load posts for one user
  loadOneUserPosts(pageNumber: Number, userId: string){
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token }`
    });
    const requestOptions = { headers: headers };
    let url = `http://localhost:3080/profile/${pageNumber}/${userId}`;
    this.http.get(url, requestOptions).subscribe((response)=>{
      console.log(response)
      this.oneUserPostsResponse.next(response)
    })
  }
}

