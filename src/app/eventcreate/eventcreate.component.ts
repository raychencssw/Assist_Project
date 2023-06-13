import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from '../event-service.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css'],
})
export class EventcreateComponent implements OnInit{

  // @ViewChild('picker') picker!: MatDatepicker<any>;
  datePickerStartAt:any;

  //2 ways: transform string date into month and date respectively 
  //1. before store them to the database(defined at eventcreate.component.ts & need to modify event.js schema)
  //2. after access them from the database(defined at event.component.ts)
  public formDate = "";

  public eventForm = {
    name: '',
    date:'',
    time: { hour: 13, minute: 30 },
    location:{
      street: '',
      city: '',
      state: '',
    },
    description: ''
  };


  //A reference to the currently opened (active) modal.
	constructor(public activeModal: NgbActiveModal, 
              private eventService: EventServiceService) {};

  ngOnInit() {
    this.datePickerStartAt = new Date();
  }


  submit(){

    console.log("submit button clicked!");
    
    //construct Date object by injecting input of user
    let tempDate = new Date(this.formDate);
    console.log("tempDate: " + tempDate);  //Fri Apr 07 2023 00:00:00 GMT-0700 (Pacific Daylight Time)

    //transformed the date format to local string format
    let formattedDate = tempDate.toLocaleDateString();
    this.eventForm.date = String(formattedDate);
    console.log("formattedDate: " + formattedDate);    //formattedDate: 4/7/2023

    //call eventService and then store the event info to the MongoDB
    this.eventService.addtoEvents(this.eventForm)

    // Close the modal
    this.activeModal.close();
  }

}
