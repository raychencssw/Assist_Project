import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';

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

  fetchStudentData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3080/ranking/student').pipe(
      catchError((error: any) => {
        console.error(error);
        // Handle the error as needed, e.g., show an error message
        return throwError('An error occurred while fetching student data.');
      })
    );
  }

  fetchSchoolData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3080/ranking/school').pipe(
      catchError((error: any) => {
        console.error(error);
        // Handle the error as needed, e.g., show an error message
        return throwError('An error occurred while fetching school data.');
      })
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
