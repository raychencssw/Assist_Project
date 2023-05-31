import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css']
})
export class EventcreateComponent {
  //A reference to the currently opened (active) modal.
	constructor(public activeModal: NgbActiveModal) {};

  submit(){
    console.log("submit button clicked!")
  }
}
