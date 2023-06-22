import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { string } from 'joi';
import * as cloudinaryCore from 'cloudinary-core';
@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  public username: string = '';
  name: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  role: number[] = [];
  points: number[] = [];
  profilepicture: string = '';
  school: string = '';
  eventsAttended: string = '';

  id: any;
  closeResult!: string;
  isWrongExtension: boolean = false
  update_username: string = '';
  update_firstname: string = '';
  update_lastname: string = '';
  update_email: string = '';
  update_school: string = '';
  update_profilepicture: string = '';


  //on selected File
  photoUrl: string = " ";
  fileToUpload: File | null = null;
  cloudinary: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      console.log(this.id)
    })

    var backendUrl = 'http://localhost:3080/profile/'
    const userid = this.id
    backendUrl = backendUrl + userid
    this.http.get<any>(backendUrl).subscribe((data) => {

      this.email = data["email"];
      this.username = data["username"];
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

    console.log('username', f.value["username"])


    this.http.post(url, f.value)
      .subscribe((result) => {
        console.log(result)
      });

    this.ngOnInit(); //reload the table  
    this.modalService.dismissAll(); //dismiss the modal
    window.location.reload();//reload the page for data update
  }


}
