import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription, debounceTime } from 'rxjs';
import { PostServiceService } from '../services/post-service.service';
import { FollowingService } from '../services/following.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementRef, Renderer2 } from '@angular/core';
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
  profilepicture: string = '';
  schoolID: string = '';
  isOwnProfile: boolean = false;
  eventsAttended: string[] = [];
  following: string[] = [];
  id: any;
  closeResult!: string;
  token: any;
  followingSubscription: Subscription | undefined;
  registerForm!: FormGroup;
  private subscription?: Subscription;
  submitted = false;
  posts: any = []
  times = []
  buttonVisible = true;
  pageNumber: any = 1
  schools: string[] = ['Los Al', 'Valley Christian', 'Orangewood Academy', 'King Drew', 'Leuzinger',
    'Poly High', 'Carson', 'Rancho Dominguez', 'South East Gate', 'Washington Prep', 'Da Vinci Schools', 'Not above'];


  updateduser: {
    [key: string]: string;
  } = {
      email: '',
      username: '',
      //password: '',
      firstname: '',
      lastname: '',
      school: '',
      //role: '',
    };

  //on selected File
  photoUrl: string = " ";
  selectedFile: File | null = null;
  fileExtension: any = " ";
  isWrongExtension: boolean = false;
  fileName: any = "";
  formData: any;
  unamePattern = '^[A-Za-z0-9_]+$'

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
    private profile: ProfileService,
    private postservice: PostServiceService,
    private followingservice: FollowingService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.registerForm = this.formBuilder.group({

      username: [new FormControl(this.username), Validators.required], // Set the default value here
      firstname: [new FormControl(this.firstname), Validators.required],
      lastname: [new FormControl(this.lastname), Validators.required],
      email: [new FormControl(this.email), [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      //password: ['', [Validators.required, Validators.minLength(6)]],
      school: ['', Validators.required],
      //role: ['', Validators.required],
    });


  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      console.log(this.id)
    })

    //check if I followed this users
    const myid = JSON.parse(localStorage.getItem("user")!).id
    this.followingservice.checkMyfollowing(myid).subscribe(
      (response) => {
        this.following = response['following']
        if (this.following.includes(this.id)) {
          this.isFollowing = true
        }
      })

    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };

    //console.log(this.token)
    var backendUrl = 'http://localhost:3080/profile/'
    const userid = this.id
    backendUrl = backendUrl + userid

    var schoolurl = 'http://localhost:3080/profile/school/' + userid
    this.http.get<any>(schoolurl, requestOptions).subscribe((data) => {
      this.schoolID = data['School']
    })

    this.http.get<any>(backendUrl, requestOptions).subscribe((data) => {
      this.email = data['email'];
      this.username = data['username'];
      this.firstname = data['firstname'];
      this.lastname = data['lastname'];
      this.role = data['role'];
      this.points = data['points']
      this.eventsAttended = data['eventsAttended']
      this.profilepicture = data['profilepicture']
      this.name = this.firstname + " " + this.lastname

      this.getPosts();

      //check if the updated button is in need by comparing  user ids
      var myid = JSON.parse(localStorage.getItem("user")!).id //get user own id from local storage
      this.isOwnProfile = myid === this.id;
    })


  }
  get f() { return this.registerForm.controls; }
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

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log('The form is invalid')
      return;
    }

    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      this.updateduser[key] = control.value
    });


    const url = 'http://localhost:3080/profileedit/' + String(this.id)

    this.formData = new FormData();


    if (this.selectedFile) {
      this.formData.append('profilepicture', this.selectedFile);
    }
    if (!this.formData['profilepicture']) {
      // No file selected, append old picture url
      this.formData.append('profilepicture', this.profilepicture);
      console.log("No change on profile picture")
    }

    this.formData.append('username', this.updateduser["username"]);
    this.formData.append('lastname', this.updateduser["lastname"]);
    this.formData.append('firstname', this.updateduser["firstname"]);
    this.formData.append('email', this.updateduser["email"]);
    this.formData.append('school', this.updateduser["school"]);

    this.profile.updateUser(this.formData, (response: any) => {
      //console.log(response)
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
    const myid = JSON.parse(localStorage.getItem("user")!).id
    if (myid === this.id) {
      //this.isFollowing = true
      const buttonElement = this.elementRef.nativeElement.querySelector('#follow');
      this.renderer.setStyle(buttonElement, 'visibility', 'hidden');

      return;
    }
    this.isFollowing = !this.isFollowing;
    this.followingservice.followButton(myid, this.id, this.isFollowing)
  }
}
