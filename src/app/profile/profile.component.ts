import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
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

  id: any;
  closeResult!: string;
  token: any
  private subscription?: Subscription;
  update_username: string = '';
  update_firstname: string = '';
  update_lastname: string = '';
  update_email: string = '';
  update_school: string = '';
  update_profilepicture: string = '';


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
    private auth: AuthService

  ) {


  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      console.log(this.id)
    })

    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token }`
    });

    const requestOptions = { headers: headers };

    console.log(this.token)
    var backendUrl = 'http://localhost:3080/profile/'
    const userid = this.id
    backendUrl = backendUrl + userid
    this.http.get<any>(backendUrl, requestOptions).subscribe((data) => {
      this.email = data['email'];
      this.username = data['username'];
      this.firstname = data['firstname'];
      this.lastname = data['lastname'];
      this.role = data['role'];
      this.points = data['points']
      this.school = data['school']
      this.eventsAttended = data['eventsAttended']
      this.profilepicture = data['profilepicture']
      this.name = this.firstname + " " + this.lastname
      //get default values
      this.update_username = this.username
      this.update_firstname = this.firstname;
      this.update_lastname = this.lastname;
      this.update_email = this.email;
      this.update_school = this.school;
      this.update_profilepicture = this.profilepicture;
    })
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
    this.formData.append('school', f.value["school"]);

    console.log('this.formData', this.formData['profilepicture'])


    this.http.post(url, this.formData)//f.value
      .subscribe((result) => {
        console.log('Data successfully sent to the server', result)
      },
        (error) => {
          console.error('Error occurred while sending data', error);
          // Handle the error here
        });

    this.ngOnInit(); //reload the table  
    this.modalService.dismissAll(); //dismiss the modal
    window.location.reload();//reload the page for data update

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
