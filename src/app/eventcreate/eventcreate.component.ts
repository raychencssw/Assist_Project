import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from 'src/app/services/event-service.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css'],
})
export class EventcreateComponent implements OnInit{
  unamePattern = '^[A-Za-z0-9\\s_]*$'
  datePickerStartAt:any;
  public formDate = "";

  public eventForm = {
    name: '',
    photo: null as File | null,
    date:'',
    start_time: { hour: 13, minute: 30 },
    end_time: { hour: 23, minute: 30 },
    location:{
      street: '',
      city: '',
      state: '',
    },
    description: ''
  };


  //A reference to the currently opened (active) modal.
  constructor(public activeModal: NgbActiveModal,
    private eventService: EventServiceService) { };

  ngOnInit() {
    this.datePickerStartAt = new Date();   //today
  }



  submit() {

    console.log("submit button clicked!");

    //construct Date object by injecting input of user
    let tempDate = new Date(this.formDate);
    console.log("tempDate: " + tempDate);  //Fri Apr 07 2023 00:00:00 GMT-0700 (Pacific Daylight Time)

    //transformed the date format to local string format
    let formattedDate = tempDate.toLocaleDateString();
    this.eventForm.date = String(formattedDate);
    console.log("formattedDate: " + formattedDate);    //formattedDate: 4/7/2023

    // this.eventForm.photo = this.selectedFile;

    console.log("eventForm: " + JSON.stringify(this.eventForm));

    //call eventService and then store the event info to the MongoDB
    this.eventService.addtoEvents(this.eventForm).subscribe( {

      next: () => {
        // Close the modal
        this.activeModal.close();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          console.error('Error 409 when occured when creating event');
        } 
        else {
          console.error('An error occurred while creating the event');
        }
      }
    });

  }

}