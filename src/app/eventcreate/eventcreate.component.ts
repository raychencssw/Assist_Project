import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventServiceService } from '../create-event-service.service';

@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css']
})
export class EventcreateComponent {

  public eventForm: any = {
    Name: '',
    Date: '',
    Time: '',
    Location: '',
    Description: ''
  };


  //A reference to the currently opened (active) modal.
	constructor(public activeModal: NgbActiveModal, 
              private eventService: CreateEventServiceService) {};

  submit(){
    console.log("submit button clicked!");
    //console.log("this.eventForm.Event: " + this.eventForm.Event);
    this.eventService.addtoEvents(this.eventForm)
  }
}
