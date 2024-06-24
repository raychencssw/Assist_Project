import { Component, OnInit} from '@angular/core';
import { PostServiceService } from 'src/app/services/post-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{
  posts: any = []       //used to store 5 most recent posts
  times = []
  userLikedPosts: any   //a json used to store the posts that the current user liked
  pageNumber: any = 1

  constructor(private postservice: PostServiceService, private auth: AuthService){
  
  }
  ngOnInit(): void {
    this.userLikedPosts = this.auth.getLikedPosts()       //should I leave this auth call here or move it to elsewhere?
    console.log('getLikedPosts(from local storage) is done!')
    console.log(this.userLikedPosts)
    this.postservice.postsResponse.subscribe(postResponse=>{
      this.posts.push(...postResponse.posts)
      console.log("getting posts from post-service........")
      console.log(this.posts)
      console.log("got posts from post-service!")
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
    if(this.userLikedPosts.includes(postId)){ //solid heart, already liked
      const filteredLikes = this.userLikedPosts.filter((id: any)=>{
        return id != postId
      })
      this.userLikedPosts = filteredLikes;
      //6/22 move auth call to post-service
      // const user = this.auth.findUser()
      // this.postservice.addRemoveLike(user['id'], postId, false)
      this.postservice.addRemoveLike(this.userLikedPosts, postId, false);
      // this.auth.setLikedPosts(this.userLikedPosts);
    }else{ //hollow heart, not liked yet
      this.userLikedPosts.push(postId);
      //6/22 move auth call to post-service
      // const user = this.auth.findUser()
      // this.postservice.addRemoveLike(user['id'], postId, true)
      this.postservice.addRemoveLike(this.userLikedPosts, postId, true);
      // this.auth.setLikedPosts(this.userLikedPosts);
    }
    this.auth.setLikedPosts(this.userLikedPosts);
    console.log("setLikedPosts done!");
  }
}