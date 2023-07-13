import { Component, OnInit} from '@angular/core';
import { PostServiceService } from 'src/app/services/post-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
  posts: any = []
  times = []
  userLikedPosts: any
  pageNumber: any = 1

  constructor(private postservice: PostServiceService, private auth: AuthService){
  
  }
  ngOnInit(): void {
    this.userLikedPosts = this.auth.getLikedPosts()
    console.log(this.userLikedPosts)
    this.postservice.postsResponse.subscribe(postResponse=>{
      this.posts.push(...postResponse.posts)
      console.log(this.posts)
      for (let i = 0; i < this.posts.length; i++) {
        const tempDate = this.posts[i]['date']
        const uploadDate = new Date(tempDate)
        const currentDate = new Date()
        const elapsedMilliseconds = currentDate.getTime() - uploadDate.getTime();
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        console.log(this.posts[i]['date'], uploadDate)

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
        }else if(elapsedSeconds > 604800){
          const formattedDate = uploadDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          this.posts[i]['date'] = formattedDate;
        }

      }
    })
    this.postservice.loadPosts(this.pageNumber++)
  }

  onScroll(){
    this.postservice.loadPosts(this.pageNumber++)
  }

  isLiked(id: any): boolean{
    // console.log(this.userLikedPosts)
    // console.log(id)
    // console.log(this.userLikedPosts.includes(id))
    return this.userLikedPosts.includes(id)
  }
  toggleLike(postId: any){
    if(this.userLikedPosts.includes(postId)){
      const filteredLikes = this.userLikedPosts.filter((id: any)=>{
        return id != postId
      })
      this.userLikedPosts = filteredLikes
      const user = this.auth.findUser()
      this.postservice.addRemoveLike(user['id'], postId, false)
      this.auth.setLikedPosts(this.userLikedPosts)
    }else{
      this.userLikedPosts.push(postId)
      const user = this.auth.findUser()
      this.postservice.addRemoveLike(user['id'], postId, true)
      this.auth.setLikedPosts(this.userLikedPosts)
    }
  }
}
