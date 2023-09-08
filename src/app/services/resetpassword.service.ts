import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {

  constructor(private http: HttpClient, private router: Router) { }
  requestReset(email: string): Observable<any> {
    return this.http.post(`http://localhost:3080/api/forgot-password`, { email });
  }
  checkTokenExpiration(token: any) {
    console.log(token)
    return this.http.get(`http://localhost:3080/api/forgot-password/verify-token/${token}`)
  }
  setnewPassword(token: any, password: any) {
    const data = {
      token: token,
      password: password
    }
    return this.http.post(`http://localhost:3080/api/forgot-password/set-password`, data)
  }

  requesteventsupervise(email: string): Observable<any> {

    return this.http.post(`http://localhost:3080/supervisorapi/send-email`, { email });
  }
  requesteventunsupervise(email: string): Observable<any> {
    return this.http.post(`http://localhost:3080/supervisorapi/send-email-unsupervise`, { email });
  }
}
