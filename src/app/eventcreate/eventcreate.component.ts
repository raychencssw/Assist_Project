import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventServiceService } from '../event-service.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css'],
})
export class EventcreateComponent {

  // @ViewChild('picker') picker!: MatDatepicker<any>;

  public eventForm: any = {
    name: '',
    date: '',
    time: '',
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


  submit(){
    console.log("submit button clicked!");
    this.eventService.addtoEvents(this.eventForm)
    // Close the modal
    this.activeModal.close();
  }

}
