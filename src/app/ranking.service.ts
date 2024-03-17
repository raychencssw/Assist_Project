import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private topStudents: any = []
  private topSchools: any = []
  token: any;
  constructor(private http: HttpClient, private auth:AuthService) {
    this.fetchStudentData();
    this.fetchSchoolData();
  }

  fetchStudentData(): Observable<any[]> {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get<any[]>('http://localhost:3080/ranking/student', requestOptions).pipe(
      catchError((error: any) => {
        console.error(error);
        // Handle the error as needed, e.g., show an error message
        return throwError('An error occurred while fetching student data.');
      })
    );
  }

  fetchSchoolData(): Observable<any[]> {
    this.token = this.auth.getAuthToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get<any[]>('http://localhost:3080/ranking/school', requestOptions).pipe(
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
