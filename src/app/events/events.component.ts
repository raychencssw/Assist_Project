import { Component, OnInit } from '@angular/core';
import { EventcreateComponent } from '../eventcreate/eventcreate.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from '../event-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchServiceService } from '../services/search-service.service';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [NgbCarouselConfig], // add NgbCarouselConfig to the component providers
})
export class EventsComponent implements OnInit {
  showNavigationArrows = true;
  showNavigationIndicators = false;

  events: any = [];             //store the events fetched from the backend
  weeklyEvents: any = [];       //store the events within 1 week
  monthlyEvents: any = [];      //store the events withing that month
  eventKeyword = new FormControl()
  searchResults: any = []
  eventId: any
  events_data: any

  weeklyEventsDisplay: any = [];
  monthlyEventsDisplay: any = [];

  public screenWidth: any;

  smallDev: boolean = false;

  constructor(private modalService: NgbModal,                   //open a modal when "create event" button is clicked
    private eventService: EventServiceService,        //load events from DB when the page is first-time loaded or after a new event is created
    private router: Router,                           //for the routerLink that direct to event deatil page
    private searchService: SearchServiceService,
    config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
  };

  ngOnInit(): void {
    //loadEvent() returns Observable, so subscribe here
    this.eventService.loadEvent().subscribe((events) => {
      console.log("ngOninit loads!");

      this.screenWidth = window.innerWidth;
      console.log("screenWidth: " + this.screenWidth);
      if (this.screenWidth < 700) {
        this.smallDev = true;
      }
      console.log("smallDev: " + this.smallDev);

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
      this.displayWeeklyEvent();
      this.displayMonthlyEvent();

      // console.log("this.weeklyEvents: " + JSON.stringify(this.weeklyEvents));
      // console.log("this.monthlyEvents: " + JSON.stringify(this.monthlyEvents));

      this.eventKeyword.reset();
      this.searchResults = [];

      this.eventKeyword.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            this.searchResults = [];
            return ([]);
          } else {
            console.log(value)
            return this.searchService.fetchAutocompleteData2(value); //changed
          }
        }
        )

      ).subscribe((data) => {
        this.searchResults = data
      });

    });

  }

  navigateToEvent(result: any) {
    this.searchService.searchevent(result).subscribe(foundEvent => {
      console.log(foundEvent)
      this.events_data = foundEvent
      this.eventId = this.events_data['_id']
      console.log(this.eventId)
      this.router.navigate([`/event-detail/${this.eventId}`])
    })

  }

  //Options available when opening new modal windows with NgbModal.open() method.
  modalOption: NgbModalOptions = {};


  createEvent() {
    //specify 'static' for a backdrop which doesn't close the modal on click.
    this.modalOption.backdrop = 'static';

    //the modal will NOT be closed when Escape key is pressed
    this.modalOption.keyboard = false;

    //open the modal window and the content inside is EventcreateComponent
    //modalRef os a reference to the newly opened modal returned by the NgbModal.open() method.
    const modalRef = this.modalService.open(EventcreateComponent, this.modalOption);

    //modalRef.result is a promise that is resolved when the modal is closed.
    modalRef.result.then(() => {
      this.eventService.loadEvent().subscribe((events) => {
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
        this.displayWeeklyEvent();
      });
    })
  }


  sortEvent() {
    this.events.sort((a: any, b: any) => {

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

      else {
        //console.log("date1 = date2, Let's compare time!")
        const hour1 = a.start_time.hour;
        const hour2 = b.start_time.hour;
        // console.log("hour1: " + hour1);
        // console.log("hour2: " + hour2);
        if (hour1 < hour2) {
          // console.log("hour1 < hour2!")
          return -1;
        }
        else if (hour1 > hour2) {
          // console.log("hour1 > hour2!")
          return 1;
        }
        else {
          const min1 = a.start_time.minute;
          const min2 = b.start_time.minute;
          // console.log("min1: " + min1);
          // console.log("min2: " + min2);
          if (min1 < min2) {
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

  displayWeekly() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // console.log("today: " + today); //Mon Jun 12 2023 00:00:00 GMT-0700 (Pacific Daylight Time)

    const WEEK = 6 * 24 * 60 * 60 * 1000;  //518,400,000

    for (let i = 0; i < this.events.length; i++) {
      const eventDate = new Date(this.events[i].date);
      // console.log("eventDate: " + eventDate);
      // console.log("event dateTime: " + eventDate.getTime());
      // console.log("today dateTime: " + today.getTime());

      const period = eventDate.getTime() - today.getTime();
      // console.log("period: " + period);
      if (period <= WEEK && period >= 0) {
        // console.log("event with name " + this.events[i].name + " and period " + period + " is within one week!" );
        let date = this.events[i].date.split("/");
        console.log("date[0]: " + date[0]);
        switch (date[0]) {
          case '1':
            this.events[i].month = 'Jan';
            break;
          case '2':
            this.events[i].month = 'Feb';
            break;
          case '3':
            this.events[i].month = 'Mar';
            break;
          case '4':
            this.events[i].month = 'Apr';
            break;
          case '5':
            this.events[i].month = 'May';
            break;
          case '6':
            this.events[i].month = 'Jun';
            break;
          case '7':
            this.events[i].month = 'Jul';
            break;
          case '8':
            this.events[i].month = 'Aug';
            break;
          case '9':
            this.events[i].month = 'Sep';
            break;
          case '10':
            this.events[i].month = 'Oct';
            break;
          case '11':
            this.events[i].month = 'Nov';
            break;
          case '12':
            this.events[i].month = 'Dec';
            break;
        }
        this.events[i].dOfmonth = date[1];
        this.weeklyEvents.push(this.events[i]);
      }
    }
  }

  displayMonthly() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    // console.log("todayYear: " + todayYear);
    // console.log("todayMonth: " + todayMonth); 


    for (let i = 0; i < this.events.length; i++) {
      const eventDate = new Date(this.events[i].date);

      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      // console.log("eventYear: " + eventYear);
      // console.log("eventMonth: " + eventMonth);

      const period = eventDate.getTime() - today.getTime();

      if (period >= 0 && eventYear == todayYear && eventMonth == todayMonth) {
        // console.log("event with name " + this.events[i].name + " and period " + period + " is within this month!" );
        let date = this.events[i].date.split("/");
        console.log("date[0]: " + date[0]);
        switch (date[0]) {
          case '1':
            this.events[i].month = 'Jan';
            break;
          case '2':
            this.events[i].month = 'Feb';
            break;
          case '3':
            this.events[i].month = 'Mar';
            break;
          case '4':
            this.events[i].month = 'Apr';
            break;
          case '5':
            this.events[i].month = 'May';
            break;
          case '6':
            this.events[i].month = 'Jun';
            break;
          case '7':
            this.events[i].month = 'Jul';
            break;
          case '8':
            this.events[i].month = 'Aug';
            break;
          case '9':
            this.events[i].month = 'Sep';
            break;
          case '10':
            this.events[i].month = 'Oct';
            break;
          case '11':
            this.events[i].month = 'Nov';
            break;
          case '12':
            this.events[i].month = 'Dec';
            break;
        }
        this.events[i].dOfmonth = date[1];
        this.monthlyEvents.push(this.events[i]);
      }
    }
  }

  displayWeeklyEvent() {

    // var templ = []
    // for(let i = 0; i < this.weeklyEvents.length; i++){
    //   if(i < 5){
    //     templ.push(this.weeklyEvents[i])
    //   }
    // }
    // this.weeklyEventsDisplay.push(templ)

    let numCal = 5  //the number of events on the screen
    if (this.smallDev) {
      numCal = 3;
    }
    console.log("numCal: " + numCal);

    let numGroup = Math.floor(this.weeklyEvents.length / numCal) + 1;  //the number of groups of events
    console.log("numGroup: " + numGroup);

    for (let i = 0; i < numGroup; i++) {
      var templ = [];
      for (let j = 0; j < numCal; j++) {
        var index = i * numCal + j
        if (index < this.weeklyEvents.length) {
          templ.push(this.weeklyEvents[index]);
        }
      }
      this.weeklyEventsDisplay.push(templ);
    }

    console.log("this.weeklyEventsDisplay.length: " + this.weeklyEventsDisplay.length)
    console.log("this.weeklyEventsDisplay[0].length: " + this.weeklyEventsDisplay[0].length)
  }

  displayMonthlyEvent() {

    // var templ = []
    // for(let i = 0; i < this.weeklyEvents.length; i++){
    //   if(i < 5){
    //     templ.push(this.weeklyEvents[i])
    //   }
    // }
    // this.weeklyEventsDisplay.push(templ)

    let numCal = 5  //the number of events on the screen
    if (this.smallDev) {
      numCal = 3;
    }
    console.log("numCal: " + numCal);

    let numGroup = Math.floor(this.monthlyEvents.length / numCal) + 1;  //the number of groups of events
    console.log("numGroup: " + numGroup);

    for (let i = 0; i < numGroup; i++) {
      var templ = [];
      for (let j = 0; j < numCal; j++) {
        var index = i * numCal + j
        if (index < this.monthlyEvents.length) {
          templ.push(this.monthlyEvents[index]);
        }
      }
      this.monthlyEventsDisplay.push(templ);
    }

    console.log("this.monthlyEventsDisplay.length: " + this.monthlyEventsDisplay.length)
    console.log("this.monthlyEventsDisplay[0].length: " + this.monthlyEventsDisplay[0].length)
  }

}