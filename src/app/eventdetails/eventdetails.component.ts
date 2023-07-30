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
  isRegistered!: boolean;
  attendees: any = []; //id
  attendees_name: any = [];
  showContainer = false;
  idToNameMap: { key: string, value: string }[] = [];
  constructor(
    private route: ActivatedRoute,                //allow the event detail page to access the URL parameter in the current path
    private eventService: EventServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.eventService.getEventById(id).pipe(delay(300)).
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
            console.log("this.users in ngOnInit:", this.idToNameMap);
          } catch (error) {
            console.error('Error in ngOnInit:', error);
          }
        })();
        this.attendees = data.registered

      });

    this.eventid = id
    this.userid = JSON.parse(localStorage.getItem('user')!).id
    //const eventsAttended: string[] = JSON.parse(localStorage.getItem('eventsAttended') || '[]');
    this.isRegistered = localStorage.getItem('eventsAttended')!.includes(this.eventid);
    this.attending = this.eventService.getAttending()

  }


  attendEvent() {
    if (this.attending.includes(this.eventid)) { //unfollow button
      const filteredFollowers: string[] = []
      this.attending.forEach((id: any) => {
        if (id !== this.eventid) {
          filteredFollowers.push(id);
        }
      });

      console.log("filteredFollowers:", filteredFollowers, "\nattending:", this.attending)
      this.attending = filteredFollowers
      this.eventService.setAttending(this.attending)
      this.eventService.attendEventById(this.eventid, this.userid, 'false').subscribe();
      console.log("Succefully unregistered")
    }

    else {
      this.attending.push(this.eventid)
      this.eventService.setAttending(this.attending)
      this.eventService.attendEventById(this.eventid, this.userid, 'true').subscribe();
      console.log("Succefully registered")
    }
    location.reload() //comment this for not reloading 
  }

  checkattend() {
    if (this.attending.includes(this.eventid)) {
      return true
    }
    return false
  }


}