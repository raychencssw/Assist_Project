import { Component, OnInit} from '@angular/core';
import { PostServiceService } from 'src/app/post-service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
  posts = []

  constructor(private postservice: PostServiceService){
  
  }
  ngOnInit(): void {
    this.postservice.postsResponse.subscribe(postList=>{
      this.posts = postList
    })
    this.postservice.loadPosts()
  }
}
