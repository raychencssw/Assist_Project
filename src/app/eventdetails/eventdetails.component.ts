import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventServiceService } from '../event-service.service';
import { HostListener, ElementRef } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css']
})
export class EventDetailsComponent implements OnInit {

  eventid: string = '';
  event: any;
  userid: string = '';
  attending: any = [];
  attendees: any = []; //user ids
  attendees_name: any = [];
  showContainer = false;
  idToNameMap: { key: string, value: string }[] = [];
  constructor(
    private route: ActivatedRoute,                //allow the event detail page to access the URL parameter in the current path
    private eventService: EventServiceService,
    private router: Router
  ) { }

  async ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.eventid = id
    this.userid = JSON.parse(localStorage.getItem('user')!).id
    this.eventService.getEventById(this.eventid).pipe(delay(300)).
      subscribe((data) => {
        this.event = data;
        //this.yourFunction(this.attendees)
        (async () => {
          try {
            const userIds: string[] = data.registered; // Replace with your list of user IDs
            // Call the 'getListOfUsernames' function and use 'await' to wait for the result
            this.attendees_name = await this.eventService.getListOfUsernames(userIds);
            this.idToNameMap = Object.keys(this.attendees_name).map(key => ({ key, value: this.attendees_name[key] }))
            // Now 'this.users' will be set with the data fetched from the backend
            this.attending = JSON.parse(localStorage.getItem('user')!).eventsAttended
          } catch (error) {
            console.error('Error in ngOnInit:', error);
          }
        })();
        this.attendees = data.registered

      });
  }

  attendEvent() {
    //follow button
    const new_array = [this.eventid]
    const users = JSON.parse(localStorage.getItem('user')!);
    users.eventsAttended = new_array
    localStorage.setItem('user', JSON.stringify(users))
    this.eventService.attendEventById(this.eventid, this.userid, 'true').subscribe();
    location.reload() //comment this for not reloading 
    console.log("Succefully registered")
  }


  unattendEvent() {
    const users_attended = JSON.parse(localStorage.getItem('user')!).eventsAttended;
    const filtered: string[] = []
    users_attended.forEach((id: any) => {
      if (id !== this.eventid) {
        filtered.push(id);
      }
    });
    const users = JSON.parse(localStorage.getItem('user')!);
    users.eventsAttended = filtered
    localStorage.setItem('user', JSON.stringify(users))
    this.eventService.attendEventById(this.eventid, this.userid, 'false').subscribe();

    location.reload() //comment this for not reloading 
    console.log("Succefully unregistered")

  }
  checkattend() {
    const id: any = this.route.snapshot.paramMap.get('id');
    const users_attended = Object.values(JSON.parse(localStorage.getItem('user')!).eventsAttended);
    if (users_attended.includes(id)) {
      return true
    }
    return false
  }
}