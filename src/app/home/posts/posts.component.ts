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
  userLikedPosts: any   //a json used to store the posts the current user liked, got from local storage
  pageNumber: any = 1

  constructor(private postservice: PostServiceService, private auth: AuthService){
  
  }
  ngOnInit(): void {
    
    // this.clearLikedPosts(); //Call the function to reset the likedPosts field, only used when developing
    // console.log('getLikedPosts(from local storage) is done!')
    // console.log(this.userLikedPosts)
    this.getUserLikedPosts();
    this.loadPosts();

  }
  loadPosts(){
    this.postservice.postsResponse.subscribe( (postResponse) => {
      this.posts.push(...postResponse.posts)
      console.log("getting posts from post-service........")
      console.log(this.posts)
      console.log("got posts from post-service!")
      this.formatPostDates();
      // for (let i = 0; i < this.posts.length; i++) {
      //   const tempDate = this.posts[i]['date']
      //   const uploadDate = new Date(tempDate)
      //   const currentDate = new Date()
      //   const elapsedMilliseconds = currentDate.getTime() - uploadDate.getTime();
      //   const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      //   console.log(this.posts[i]['date'], uploadDate)

      //   if(elapsedSeconds < 60){
      //     this.posts[i]['date'] = `${elapsedSeconds} seconds ago`
      //   }else if(elapsedSeconds < 3600){
      //     const minutes = Math.floor(elapsedSeconds / 60);
      //     if(minutes <= 1){
      //       this.posts[i]['date'] = `${minutes} minute ago`
      //     }else{
      //       this.posts[i]['date'] = `${minutes} minutes ago`
      //     }
      //   }else if(elapsedSeconds < 86400){
      //     const hours = Math.floor(elapsedSeconds / 3600);
      //     if(hours <= 1){
      //       this.posts[i]['date'] = `${hours} hour ago`
      //     }else{
      //       this.posts[i]['date'] = `${hours} hours ago`
      //     }
      //   }else if (elapsedSeconds < 604800) {
      //     const days = Math.floor(elapsedSeconds / 86400);
      //     if(days <= 1){
      //       this.posts[i]['date'] = `${days} day ago`;
      //     }else{
      //       this.posts[i]['date'] = `${days} days ago`;
      //     }
      //   }else if(elapsedSeconds > 604800){
      //     const formattedDate = uploadDate.toLocaleDateString('en-US', {
      //       day: 'numeric',
      //       month: 'long',
      //       year: 'numeric'
      //     });
      //     this.posts[i]['date'] = formattedDate;
      //   }

      // }
    })
    this.postservice.loadPosts(this.pageNumber++)
  }

  formatPostDates() {
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
    this.setUserLikedPosts(this.userLikedPosts);
    console.log("setLikedPosts done!");

    //6/26 23:17 how do I make the "likedBy...." refresh automatically?
    //see line 132 of events.component.ts
    //6/29 23:12 wait rewrite to updatePostLikes & new toggleLike
    this.getUserLikedPosts();
    this.updatePosts();

  }

  updatePosts(){
    this.posts = [];
    for(let i = 1; i < this.pageNumber+1 ; i++){
      this.postservice.loadPosts(i);
    }
  }

  getUserLikedPosts(){
    this.userLikedPosts = this.auth.getLikedPosts();       //should I leave this auth call here or move it to elsewhere?
    console.log('getLikedPosts(from local storage) is done!');
    console.log(this.userLikedPosts);
  }

  setUserLikedPosts(userLikedPosts:any){
    this.userLikedPosts = this.auth.setLikedPosts(userLikedPosts);       //should I leave this auth call here or move it to elsewhere?
    console.log('setLikedPosts(from local storage) is done!');
    console.log(this.userLikedPosts);
  }

  // Function to clear the likedPosts field from local storage
  clearLikedPosts() {
    // Check if likedPosts exists in local storage
    if (localStorage.getItem('likedposts')) {
      // Remove the likedPosts field from local storage
      localStorage.setItem('likedposts',JSON.stringify(''));
      console.log('likedPosts field has been reset from local storage.');
    } else {
      console.log('No likedPosts field found in local storage.');
    }
  }

}