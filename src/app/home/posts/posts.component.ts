import { Component, OnInit} from '@angular/core';
import { PostServiceService } from 'src/app/post-service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
  posts: any = []
  times = []
  constructor(private postservice: PostServiceService){
  
  }
  ngOnInit(): void {
    this.postservice.postsResponse.subscribe(postResponse=>{
      this.posts = postResponse.posts
      console.log(this.posts)
      for (let i = 0; i < this.posts.length; i++) {
        const tempDate = this.posts[i]['date']
        const uploadDate = new Date(tempDate)
        const currentDate = new Date()
        const elapsedMilliseconds = currentDate.getTime() - uploadDate.getTime();
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        console.log(elapsedSeconds)
        if(elapsedSeconds < 60){
          this.posts[i]['date'] = `${elapsedSeconds} seconds ago`
        }else if(elapsedSeconds < 3600){
          const minutes = Math.floor(elapsedSeconds / 60);
          if(minutes <= 1){
            this.posts[i]['date'] = `${minutes} minute ago`
          }else{
            this.posts[i]['date'] = `${minutes} minutes ago`
          }
        }else if(elapsedSeconds < 86400){
          const hours = Math.floor(elapsedSeconds / 3600);
          if(hours <= 1){
            this.posts[i]['date'] = `${hours} hour ago`
          }else{
            this.posts[i]['date'] = `${hours} hours ago`
          }
        }else if (elapsedSeconds < 604800) {
          const days = Math.floor(elapsedSeconds / 86400);
          if(days <= 1){
            this.posts[i]['date'] = `${days} day ago`;
          }else{
            this.posts[i]['date'] = `${days} days ago`;
          }
        }

      }
    })
    this.postservice.loadPosts()
  }
}
