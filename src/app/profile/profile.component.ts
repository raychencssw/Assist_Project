import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription, debounceTime } from 'rxjs';
import { FollowingService } from '../services/following.service';
import { PostServiceService } from '../services/post-service.service';
import { Console } from 'console';

@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  isFollowing: boolean = false;
  getUserProfile!: any;
  username: string = '';
  name: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  role: number | undefined;
  points: number | undefined;
  profilepicture: any;
  school: string = '';
  isOwnProfile: boolean = false;
  eventsAttended: string[] = [];
  following: any = [];
  id: any;
  closeResult!: string;
  token: any;
  followingSubscription: Subscription | undefined;
  private subscription?: Subscription;
  update_username: string = '';
  update_firstname: string = '';
  update_lastname: string = '';
  update_email: string = '';
  update_school: string = '';
  update_profilepicture: string = '';
  currentUser: any


  followers: any = []
  showFollowers = false;
  posts: any = []
  times = []
  pageNumber: any = 1

  //on selected File
  photoUrl: string = " ";
  selectedFile: File | null = null;
  fileExtension: any = " ";
  isWrongExtension: boolean = false;
  fileName: any = "";
  formData: any;
  myid: any;
  sameUser: boolean = false

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
    private profile: ProfileService,
    private postservice: PostServiceService,
    private profileService: ProfileService,
    private followingservice: FollowingService,
    // private following: FollowingService
  ) {


  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      console.log("my id changes to: " + this.id)
      const user = this.auth.findUser()
      if(user.id == this.id){
        this.sameUser = true
      }

    })

    this.following = this.auth.getFollowing()
    console.log(this.following)
    this.profileService.profileResponse.subscribe(
      (data) => {

        this.getUserProfile = data
        console.log(this.getUserProfile)
        this.email = this.getUserProfile['email'];
        this.username = this.getUserProfile['username'];
        this.firstname = this.getUserProfile['firstname'];
        this.lastname = this.getUserProfile['lastname'];
        this.role = this.getUserProfile['role'];
        this.points = this.getUserProfile['points']
        if(this.getUserProfile['school']){
          this.school = this.getUserProfile['school']['name']
        }
        this.eventsAttended = this.getUserProfile['eventsAttended']
        this.profilepicture = this.getUserProfile['profilepicture']
        this.name = this.firstname + " " + this.lastname
        // Process the retrieved profile data
        this.update_username = this.username
        this.update_firstname = this.firstname;
        this.update_lastname = this.lastname;
        this.update_email = this.email;
        this.update_school = this.school;
        this.update_profilepicture = this.profilepicture;
      }, (error) => {
        console.log("profile error", error)
        // Handle any errors that occur during the API call
      }
    )
    this.profileService.getUserProfile(this.id)
    this.myid = JSON.parse(localStorage.getItem("user")!).id
    this.isOwnProfile = this.myid === this.id;
    this.getPosts()
    this.followingservice.following$.subscribe((response)=>{
      this.followers = response
    })
    this.followingservice.getFollowers()
  }

  getPosts() {
    this.postservice.oneUserPostsResponse.subscribe(postResponse => {
      this.posts.push(...postResponse.posts)
      console.log(this.posts)
      for (let i = 0; i < this.posts.length; i++) {
        const tempDate = this.posts[i]['date']
        const uploadDate = new Date(tempDate)
        const currentDate = new Date()
        const elapsedMilliseconds = currentDate.getTime() - uploadDate.getTime();
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

        if (elapsedSeconds < 60) {
          this.posts[i]['date'] = `${elapsedSeconds} seconds ago`
        } else if (elapsedSeconds < 3600) {
          const minutes = Math.floor(elapsedSeconds / 60);
          if (minutes <= 1) {
            this.posts[i]['date'] = `${minutes} minute ago`
          } else {
            this.posts[i]['date'] = `${minutes} minutes ago`
          }
        } else if (elapsedSeconds < 86400) {
          const hours = Math.floor(elapsedSeconds / 3600);
          if (hours <= 1) {
            this.posts[i]['date'] = `${hours} hour ago`
          } else {
            this.posts[i]['date'] = `${hours} hours ago`
          }
        } else if (elapsedSeconds < 604800) {
          const days = Math.floor(elapsedSeconds / 86400);
          if (days <= 1) {
            this.posts[i]['date'] = `${days} day ago`;
          } else {
            this.posts[i]['date'] = `${days} days ago`;
          }
        }
      }
    })
    this.postservice.loadOneUserPosts(this.pageNumber++, this.id)
  }

  modalOption: NgbModalOptions = {};

  editUserInfo(content: any) {
    // this.router.navigate(['/profileedit'])
    //const modalRef = this.modalService.open(ProfileeditComponent, this.modalOption);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:3080/profileedit/' + String(this.id)
    this.formData = new FormData();


    if (this.selectedFile) {
      this.formData.append('profilepicture', this.selectedFile);

    }
    if (!this.formData['profilepicture']) {
      // No file selected, append old picture url
      this.formData.append('profilepicture', this.update_profilepicture);
      console.log("No change on profile picture")
    }


    this.formData.append('username', f.value["username"]);
    this.formData.append('lastname', f.value["lastname"]);
    this.formData.append('firstname', f.value["firstname"]);
    this.formData.append('email', f.value["email"]);

    this.profile.updateUser(this.formData, (response: any)=>{
      console.log(response)
      this.ngOnInit(); //reload the table  
      this.modalService.dismissAll(); //dismiss the modal
      window.location.reload();//reload the page for data update

    })

  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] as File
    this.fileName = this.selectedFile.name
    this.fileExtension = this.fileName.split('.').pop()
    if (this.fileExtension !== 'jpeg' && this.fileExtension !== 'jpg' && this.fileExtension !== 'png') {
      this.isWrongExtension = true
    } else {
      this.isWrongExtension = false
    }
  }


  onScroll() {
    this.postservice.loadOneUserPosts(this.pageNumber++, this.id)
  }

  async followUser() {
    // users cannot follow themselves 
    console.log('THis is follow user', this.id)
    // const myid = JSON.parse(localStorage.getItem("user")!).id
    // if (myid === this.id) {
    //   this.isFollowing = true
    //   this.modalService.open("You Cannot Follow Yourself");
    // }
    // this.isFollowing = !this.isFollowing;
    // this.followingservice.followButton(myid, this.id, this.isFollowing)

    const myid = JSON.parse(localStorage.getItem("user")!).id
    if(this.following.includes(this.id)){
      const filteredFollowers = this.following.filter((filterid: any)=>{
        filterid != this.id
      })
      this.following = filteredFollowers
      this.auth.setFollowing(this.following)
      this.followingservice.followButton(myid, this.id, true)
    }else{
      this.following.push(this.id)
      this.auth.setFollowing(this.id)
      this.followingservice.followButton(myid, this.id, false)
    }
  }
  checkFollow(){
    if(this.following.includes(this.id)){
      return true
    }
    return false
  }


}
