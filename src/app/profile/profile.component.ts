import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { ProfileService } from '../services/profile.service';
=======
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
>>>>>>> origin/ChengShi

@Component({

  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{


<<<<<<< HEAD
  constructor(private profileService: ProfileService){}

  ngOnInit(): void {
    this.profileService.profileResponse.subscribe(profile=>{
      console.log(profile)
    })
  }
=======
export class ProfileComponent implements OnInit {
  public username: string[] = [];
  name: string | undefined;
  firstname: string[] = [];
  lastname: string[] = [];
  email: string[] = [];
  role: number[] = [];
  points: number[] = [];
  profilepicture: string[] = [];
  school: string[] = [];
  eventsAttended: string[] = [];
  id: any;
  closeResult!: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,

  ) {


  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
      console.log(this.id)
    })

    var backendUrl = 'http://localhost:3080/profile/'
    const userid = this.id
    backendUrl = backendUrl + userid
    this.http.get<any>(backendUrl).subscribe((data) => {
      this.email = data['email'];
      this.username = data['username'];
      this.firstname = data['firstname'];
      this.lastname = data['lastname'];
      this.role = data['role'];
      this.points = data['points']
      this.school = data['school']
      this.eventsAttended = data['eventsAttended']
      this.name = this.firstname + " " + this.lastname

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
    console.log('Update form value', f.value)

    this.http.post(url, f.value)
      .subscribe((result) => {
        console.log(result)
      });
    this.ngOnInit(); //reload the table  
    this.modalService.dismissAll(); //dismiss the modal
  }

>>>>>>> origin/ChengShi
}
