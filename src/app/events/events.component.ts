import { Component, OnInit } from '@angular/core';
//import { Event } from '../type'
//import { weeklyEvents } from '../fake-data'
//import { monthlyEvents } from '../fake-data'
import { EventcreateComponent } from '../eventcreate/eventcreate.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from '../event-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{

  events: any = [];             //store the events fetched from the backend
  weeklyEvents: any = [];       //store the events within 1 week
  monthlyEvents: any = [];      //store the events withing that month

  constructor(private modalService: NgbModal,                   //open a modal when "create event" button is clicked
              private eventService: EventServiceService,        //load events from DB when the page is first-time loaded or after a new event is created
              private router: Router){};                        //for the routerLink that direct to event deatil page

  ngOnInit():void{
    //loadEvent() returns Observable, so subscribe here
    this.eventService.loadEvent().subscribe((events) => {
      console.log("ngOninit loads!");

      this.weeklyEvents = [];
      this.monthlyEvents = [];

      //store the events from the MongoDB to this.events(not sorted yet)
      this.events = events;
      //console.log("this.events: " + JSON.stringify(this.events));

      //sort the events according to the date
      this.sortEvent();
      //console.log("this.events(sorted): " + JSON.stringify(this.events));

      this.displayWeekly();
      this.displayMonthly();

      // console.log("this.weeklyEvents: " + JSON.stringify(this.weeklyEvents));
      // console.log("this.monthlyEvents: " + JSON.stringify(this.monthlyEvents));

    });

  }

  //Options available when opening new modal windows with NgbModal.open() method.
  modalOption: NgbModalOptions = {};


  createEvent(){
    //specify 'static' for a backdrop which doesn't close the modal on click.
    this.modalOption.backdrop = 'static'; 

    //the modal will NOT be closed when Escape key is pressed
    this.modalOption.keyboard = false;

    //open the modal window and the content inside is EventcreateComponent
    //modalRef os a reference to the newly opened modal returned by the NgbModal.open() method.
		const modalRef = this.modalService.open(EventcreateComponent,this.modalOption);

    //modalRef.result is a promise that is resolved when the modal is closed.
    modalRef.result.then(()=>{
      this.eventService.loadEvent().subscribe( (events) => {
        console.log("modal closed!");

        this.weeklyEvents = [];
        this.monthlyEvents = [];

        //store the events from the MongoDB to this.events(not sorted yet)
        this.events = events;
        //console.log("this.events: " + JSON.stringify(this.events));

        //sort the events according to the date
        this.sortEvent();
        //console.log("this.events(sorted): " + JSON.stringify(this.events));

        this.displayWeekly();
        this.displayMonthly();
      });
    })
  }


  sortEvent(){
    this.events.sort((a:any,b:any) => {

      //To compare date, need to transform each locale string formatted date back to original date format(in milliseconds)
      const date1 = new Date(a.date);
      const date2 = new Date(b.date);
      // console.log("date1: " + date1);
      // console.log("date2: " + date2);
      if (date1 < date2) {
        // console.log("date1 < date2!")
        return -1;
      }
      else if (date1 > date2) {
        // console.log("date1 > date2!")
        return 1;
      }

      else{
        //console.log("date1 = date2, Let's compare time!")
        const hour1 = a.time.hour;
        const hour2 = b.time.hour;
        // console.log("hour1: " + hour1);
        // console.log("hour2: " + hour2);
        if(hour1 < hour2){
          // console.log("hour1 < hour2!")
          return -1;
        }
        else if (hour1 > hour2) {
          // console.log("hour1 > hour2!")
          return 1;
        }
        else{
          const min1 = a.time.minute;
          const min2 = b.time.minute;
          // console.log("min1: " + min1);
          // console.log("min2: " + min2);
          if(min1 < min2){
            // console.log("min1 < min2!")
            return -1;
          }
          else if (min1 > min2) {
            // console.log("min1 > min2!")
            return 1;
          }
          // console.log("dateTime1 = dateTime2!")
          return 0
        }
      }
    })
  }

  displayWeekly(){

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // console.log("today: " + today); //Mon Jun 12 2023 00:00:00 GMT-0700 (Pacific Daylight Time)

    const WEEK = 6 * 24 * 60 * 60 * 1000;  //518,400,000

    for (let i = 0; i < this.events.length; i++){
      const eventDate = new Date(this.events[i].date);
      // console.log("eventDate: " + eventDate);
      // console.log("event dateTime: " + eventDate.getTime());
      // console.log("today dateTime: " + today.getTime());

      const period = eventDate.getTime() - today.getTime();
      // console.log("period: " + period);
      if( period <= WEEK && period >= 0){
        // console.log("event with name " + this.events[i].name + " and period " + period + " is within one week!" );
        this.weeklyEvents.push(this.events[i]);
      }
    }
  }

  displayMonthly(){

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    // console.log("todayYear: " + todayYear);
    // console.log("todayMonth: " + todayMonth); 


    for (let i = 0; i < this.events.length; i++){
      const eventDate = new Date(this.events[i].date);

      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      // console.log("eventYear: " + eventYear);
      // console.log("eventMonth: " + eventMonth);

      const period = eventDate.getTime() - today.getTime();

      if(period >= 0 && eventYear == todayYear && eventMonth == todayMonth){
        // console.log("event with name " + this.events[i].name + " and period " + period + " is within this month!" );
        this.monthlyEvents.push(this.events[i]);
      }
    }
  }

}
