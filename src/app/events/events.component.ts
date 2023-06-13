import { Component, OnInit } from '@angular/core';
import { Event } from '../type'
//import { weeklyEvents } from '../fake-data'
import { monthlyEvents } from '../fake-data'
import { EventcreateComponent } from '../eventcreate/eventcreate.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from '../event-service.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{

  events: any = [];             //store the events fetched from the backend
  weeklyEvents: any = [];
  monthlyEvents: Event[] = [];

  //A service for opening modal windows.
  //pass NgbModal as an argument
  constructor(private modalService: NgbModal,
              private eventService: EventServiceService){};

  ngOnInit():void{
    //loadEvent() returns Observable, so subscribe here
    this.eventService.loadEvent().subscribe((events) => {

      //store the events from the MongoDB to this.events(not sorted yet)
      this.events = events;
      console.log("this.events: " + JSON.stringify(this.events));

      //sort the events according to the date
      this.sortEvent();
      console.log("this.events(sorted): " + JSON.stringify(this.events));

      this.weeklyEvents = this.events;   //need to be replaced
      console.log("this.weeklyEvents: " + JSON.stringify(this.weeklyEvents));


      //this.dateConverter();
    });

    
    this.monthlyEvents = monthlyEvents;   //need to be replaced
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
  }


  sortEvent(){
    this.events.sort((a:any,b:any) => {

      //To compare date, need to transform each locale string formatted date back to original date format
      const date1 = new Date(a.date);
      const date2 = new Date(b.date);
      console.log("date1: " + date1);
      console.log("date2: " + date2);
      if (date1 < date2) {
        console.log("date1 < date2!")
        return -1;
      }
      else if (date1 > date2) {
        console.log("date1 > date2!")
        return 1;
      }

      else{
        console.log("date1 = date2, Let's compare time!")
        const hour1 = a.time.hour;
        const hour2 = b.time.hour;
        console.log("hour1: " + hour1);
        console.log("hour2: " + hour2);
        if(hour1 < hour2){
          console.log("hour1 < hour2!")
          return -1;
        }
        else if (hour1 > hour2) {
          console.log("hour1 > hour2!")
          return 1;
        }
        else{
          const min1 = a.time.minute;
          const min2 = b.time.minute;
          console.log("min1: " + min1);
          console.log("min2: " + min2);
          if(min1 < min2){
            console.log("min1 < min2!")
            return -1;
          }
          else if (min1 > min2) {
            console.log("min1 > min2!")
            return 1;
          }
          console.log("dateTime1 = dateTime2!")
          return 0
        }
      }
    })
  }

  dateConverter(){
    this.events.length.sort
    for (let i = 0; i < this.events.length; i++) {
      const date = new Date(this.events[i]["date"]);
      console.log("date: " + date);  //Fri Jun 30 2023 00:00:00 GMT-0700 (Pacific Daylight Time)
      const dayOfWeek = date.getDay();
      console.log("dayOfWeek: " + dayOfWeek);
    }
  }
}
