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

  datePickerStartAt:any;

  /**
   *   Date handling: The user's input was string originally and was assigned to formDate. Then it is passed
   *                  to Date object to allow further operation. A method toLocaleDateString() is applied to
   *                  the Date object to transform it to local string format. In the end, the whole form along
   *                  with the transformed date is sent to backend through eventService.addtoEvents()
   **/


  //used to receive from the user input, then it'll be passed into Date object and be 
  //transformed to local string format before sending to backend.
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
    this.eventService.addtoEvents(this.eventForm).subscribe(() => {
      // Close the modal
      this.activeModal.close();
    })

  }

}
