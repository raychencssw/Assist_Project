import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class OtpService {
    token: any

    constructor(private http: HttpClient, private auth: AuthService){
        this.token = this.auth.getAuthToken()
    }

    getOtp(email: string): Observable<any> {
        console.log(email)
        this.token = this.auth.getAuthToken()
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token }`
        });
        const requestOptions = { headers: headers };
        let url = `http://localhost:3080/api/getOtp/${email}`
        return this.http.get<any>(url, requestOptions);
    }
}



