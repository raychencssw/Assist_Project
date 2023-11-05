import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Console } from 'console';

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
  supervisorId = '653eeacc180c3ae1a2dcf019';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getStudentsinfo(this.supervisorId).subscribe((data) => {
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
        }
      }
    });

  }

  onSubmit() { //post the data into the databases
    console.log(this.studentsInfo)
  }

  getStudentsinfo(supervisorId: string): Observable<any> {
    return this.http.get(`http://localhost:3080/supervisorCheck/${supervisorId}`)
  }

}