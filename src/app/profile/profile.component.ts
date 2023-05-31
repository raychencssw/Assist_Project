import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  username: string[] = [];
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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {


  }
  jsonData: any;

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

      console.log("Get Data Successfully");
    })
  }

}
