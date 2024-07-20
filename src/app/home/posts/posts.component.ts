import { Component, OnInit} from '@angular/core';
import { PostServiceService } from 'src/app/services/post-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LikedByModalComponent } from '../../liked-by-modal/liked-by-modal.component'

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

  constructor(private modalService: NgbModal, 
              private postservice: PostServiceService, 
              private auth: AuthService){
  
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
    const post = this.posts.find((p: any) => p.id === postId);

    if(this.userLikedPosts.includes(postId)){ //solid heart, already liked, cancel liked
      const filteredLikes = this.userLikedPosts.filter((id: any)=>{
        return id != postId
      })
      this.userLikedPosts = filteredLikes;
      this.postservice.addRemoveLike(this.userLikedPosts, postId, false);
      this.updateLocalPostLikeStatus(post, false);
    }else{ //hollow heart, not liked yet, add to like
      this.userLikedPosts.push(postId);
      this.postservice.addRemoveLike(this.userLikedPosts, postId, true);
      this.updateLocalPostLikeStatus(post, true);
    }
    this.setUserLikedPosts(this.userLikedPosts);
    console.log("setLikedPosts done!");

    this.getUserLikedPosts();

  }

  updateLocalPostLikeStatus(post: any, addToLike: boolean) {
    const currentUser = this.auth.findUser();
    console.log('user ' + currentUser.id + '/' + currentUser.userName + ' is toggling post ' + post.id)

    if (addToLike) {
      post.likedBy.push({ id: currentUser.id, username: currentUser.userName });
      console.log(post.id + ' is liked!')
      console.log('posts: ', this.posts);
    } else {
      post.likedBy = post.likedBy.filter((user: any) => user.id !== currentUser.id);
      console.log(post.id + 'is canceled!')
      console.log('posts: ', this.posts);
    }
  }


  getUserLikedPosts(){
    this.userLikedPosts = this.auth.getLikedPosts();       //should I leave this auth call here or move it to elsewhere?
    console.log('getLikedPosts(from local storage) is done!');
    console.log(this.userLikedPosts);
  }

  setUserLikedPosts(userLikedPosts:any){
    console.log('setting setLikedPosts to local storage...');
    console.log(this.userLikedPosts);
    this.auth.setLikedPosts(userLikedPosts);       //should I leave this auth call here or move it to elsewhere?
    console.log('setLikedPosts(to local storage) is done!');
    console.log(this.userLikedPosts);
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

  // openLikedByModal(likedBy:[]){
    
  //       // console.log(likedBy);
  //       let likedByUser = likedBy.slice(1);  //make a shallow copy of the array
  //       // console.log(likedBy);
  //       console.log(likedByUser);
  //       //open the modal window and the content inside is EventcreateComponent
  //       //modalRef os a reference to the newly opened modal returned by the NgbModal.open() method.
  //       const modalRef = this.modalService.open(LikedByModalComponent);
  //       modalRef.componentInstance.likedBy = likedByUser;
  // }

  openLikedByModal(post:any){
    

    console.log(post);
    //open the modal window and the content inside is EventcreateComponent
    //modalRef os a reference to the newly opened modal returned by the NgbModal.open() method.
    const modalRef = this.modalService.open(LikedByModalComponent);
    modalRef.componentInstance.post = post;
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