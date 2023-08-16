import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CheckinService {
    
    constructor(private http: HttpClient) {

    }

    checkin(email: string, eventId: string): Observable<any> {
        const checkinData = {
            email: email,
            eventId: eventId
        }

        return this.http.post<any>('http://localhost:3080/api/checkin',checkinData);
    }

    guestCheckin(email: string, eventId: string, memberEmail: string): Observable<any> {
        const guestCheckinData = {
            email: email,
            eventId: eventId,
            memberEmail: memberEmail
        }

        return this.http.post<any>('http://localhost:3080/api/guestcheckin',guestCheckinData);
    }
    
    checkout(email: string, eventId: string, mood: string | null): Observable<any> {
        const checkoutData = {
            email: email,
            eventId: eventId,
            mood: mood,
        }

        return this.http.post<any>('http://localhost:3080/api/checkout', checkoutData);
    }

    guestCheckout(email: string, eventId: string, mood: string | null): Observable<any> {
        const guestCheckoutData = {
            email: email,
            eventId: eventId,
            mood: mood,
        }

        return this.http.post<any>('http://localhost:3080/api/guestcheckout',guestCheckoutData);
    }
}