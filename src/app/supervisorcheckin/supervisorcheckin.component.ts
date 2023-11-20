import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-supervisorcheckin',
  templateUrl: './supervisorcheckin.component.html',
  styleUrls: ['./supervisorcheckin.component.css']
})
export class SupervisorcheckinComponent {
  studentsInfo: any[] = [];
  /*studentsInfo [
   {checkin: true
   checkout: false
   id: "64afa566a903aede257c3c69"
   name: "jitb banerjee"},{...}
  ]
 
*/
  //http://localhost:4200/supervisorcheck/653eeacc180c3ae1a2dcf019/64c6f576974de6f0d85a474f
  supervisorId = '';

  eventId = '';

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      const eventId1 = params['eventId'];
      const supervisorId1 = params['supervisorId'];
      this.supervisorId = supervisorId1;
      this.eventId = eventId1;
    });

    this.getStudentsinfo(this.supervisorId, this.eventId).subscribe((data) => {
      let info = JSON.parse(JSON.stringify(data));

      for (let key in info) {
        if (info.hasOwnProperty(key)) {
          // Create a new student object and populate its properties
          let student = {
            id: key,
            name: info[key], // Change 'name' to the actual property name
            checkin: false,
            checkout: false
          };

          // Push the student object into the studentsInfo array
          this.studentsInfo.push(student);
          console.log(this.studentsInfo);
        }
      }
    });

  }

  onSubmit() {
    // WorkFlow
    // 1. add a attandanceSchema into eventSchema, submit the data to the event.attendance
    // 2. backend put http method
    // 3. put the data from the frontend to the backend
    const attendanceData = this.studentsInfo.map(student => ({
      userId: student.id,
      name: student.name,
      checkin: student.checkin,
      checkout: student.checkout
    }));

    this.http.post(`http://localhost:3080/supervisorcheck/attendances/${this.eventId}`, { attendances: attendanceData })
      .subscribe((data) => {
        //console.log("Success Add Attendances", data);
        alert("Success Add Attendances");
      });
  }

  getStudentsinfo(supervisorId: string, eventId: string): Observable<any> {
    return this.http.get(`http://localhost:3080/supervisorcheck/${eventId}/${supervisorId}`);
  }


}