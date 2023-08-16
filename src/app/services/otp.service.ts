import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class OtpService {

    constructor(private http: HttpClient, private auth: AuthService){
    }

    getOtp(email: string): Observable<any> {
        console.log(email)
        let url = `http://localhost:3080/api/getOtp/${email}`
        return this.http.get<any>(url);
    }
}


