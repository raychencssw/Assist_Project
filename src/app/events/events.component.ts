import { Component, OnInit } from '@angular/core';
import { Event } from '../type'
import { weeklyEvents } from '../fake-data'
import { monthlyEvents } from '../fake-data'
import { EventcreateComponent } from '../eventcreate/eventcreate.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{

  weeklyEvents: Event[] = [];
  monthlyEvents: Event[] = [];
  // public Event:{ Date: string; Time: string; Name: string; Location: string }  = {
  //   Date: '',
  //   Time: '',
  //   Name: '',
  //   Location: ''
  //   // how to access each event detail? 
  // }

  //A service for opening modal windows.
  //pass NgbModal as an argument
  constructor(private modalService: NgbModal){};

  ngOnInit():void{
    this.weeklyEvents = weeklyEvents;
    this.monthlyEvents = monthlyEvents;
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
}
