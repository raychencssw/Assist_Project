import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  getUserProfile!: any;
  username: string = '';
  name: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  role: number | undefined;
  points: number | undefined;
  profilepicture: string = '';
  school: string = '';
  eventsAttended: string[] = [];
  myid: string = '';
  id: any;
  closeResult!: string;
  token: any;
  private subscription?: Subscription;
  update_username: string = '';
  update_firstname: string = '';
  update_lastname: string = '';
  update_email: string = '';
  update_school: string = '';
  update_profilepicture: string = '';
  isOwnProfile: boolean = false;

  //on selected File
  photoUrl: string = " ";
  selectedFile: File | null = null;
  fileExtension: any = " ";
  isWrongExtension: boolean = false;
  fileName: any = "";
  formData: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthService,
    private profileService: ProfileService
  ) {

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    })
    this.profileService.getUserProfile(this.id).subscribe(
      (data) => {
        this.getUserProfile = data
        this.email = this.getUserProfile['email'];
        this.username = this.getUserProfile['username'];
        this.firstname = this.getUserProfile['firstname'];
        this.lastname = this.getUserProfile['lastname'];
        this.role = this.getUserProfile['role'];
        this.points = this.getUserProfile['points']
        this.school = this.getUserProfile['school']
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
    this.myid = JSON.parse(localStorage.getItem("user")!).id
    this.isOwnProfile = this.myid === this.id;
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
    this.formData.append('school', f.value["school"]);

    //console.log('this.formData', this.formData['profilepicture'])

    this.profileService.editUserProfile(this.id, this.username, this.formData).subscribe(
      (data) => {
        console.log("Updated User Profile Data Sent to Server")
      })

    this.ngOnInit(); //reload the table  
    this.modalService.dismissAll(); //dismiss the modal
    //window.location.reload();//reload the page for data update

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
}
