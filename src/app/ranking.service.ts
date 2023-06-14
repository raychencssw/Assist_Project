import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private topStudents: any = []
  private topSchools: any = []
  constructor(private http: HttpClient) {
    this.fetchStudentData();
    this.fetchSchoolData();
  }

  //TODO: Handle error
  fetchStudentData() {
    this.http.get('http://localhost:3080/ranking/student')
      .subscribe(
        (response: any) => {
          this.topStudents = response;
        },
        (error) => {
          //Handle any errror
          console.error(error)
        }
      );
  }

  //TODO: Handle error
  fetchSchoolData() {
    this.http.get('http://localhost:3080/ranking/school')
      .subscribe(
        (response: any) => {
          this.topSchools = response;
        },
        (error) => {
          //Handle any errror
          console.error(error)
        }
      );
  }

  setTopStudents(students: any):void {
    this.topStudents = students;
  }

  getTopStudents() : any {
    return this.topStudents;
  }

  setTopSchools(schools: any) : void {
    this.topSchools = schools;
  }

  getTopSchools() : any {
    return this.topSchools;
  }
}
