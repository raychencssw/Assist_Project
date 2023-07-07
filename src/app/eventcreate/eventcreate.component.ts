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
export class EventcreateComponent implements OnInit {

  datePickerStartAt: any;

  unamePattern = '^[A-Za-z0-9_]+$'
  selectedFile: File | null = null;
  fileExtension: any = "";
  fileName: any = "";
  isWrongExtension: boolean = false;


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
    photo: null as File | null,
    date: '',
    time: { hour: 13, minute: 30 },
    location: {
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
    this.datePickerStartAt = new Date();
  }

  onFileSelected(event: any) {
    console.log("event: " + JSON.stringify(event));  //{"isTrusted":true}
    console.log("event.target: " + JSON.stringify(event.target)); //event.target{"__ngContext__":45,"__zone_symbol__inputfalse":[{"type":"eventTask","state":"scheduled","source":"HTMLInputElement.addEventListener:input","zone":"angular","runCount":2}],"__zone_symbol__blurfalse":[{"type":"eventTask","state":"scheduled","source":"HTMLInputElement.addEventListener:blur","zone":"angular","runCount":2}],"__zone_symbol__compositionstartfalse":[{"type":"eventTask","state":"scheduled","source":"HTMLInputElement.addEventListener:compositionstart","zone":"angular","runCount":0}],"__zone_symbol__compositionendfalse":[{"type":"eventTask","state":"scheduled","source":"HTMLInputElement.addEventListener:compositionend","zone":"angular","runCount":0}],"__zone_symbol__changefalse":[{"type":"eventTask","state":"running","source":"HTMLInputElement.addEventListener:change","zone":"angular","runCount":2}]}
    console.log("event.target.files: " + JSON.stringify(event.target.files)); //{"0":{}}
    console.log("event.target.files[0].name: " + JSON.stringify(event.target.files[0].name));

    this.selectedFile = event.target.files[0] as File
    this.fileName = this.selectedFile.name

    console.log("this.fileName.split('.'): " + this.fileName.split('.'));
    //pop removes and returns the last element of the array
    this.fileExtension = this.fileName.split('.').pop();
    console.log("file name: " + this.fileName);
    console.log("file extension: " + this.fileExtension);
    if (this.fileExtension !== 'jpeg' && this.fileExtension !== 'jpg' && this.fileExtension !== 'png') {
      this.isWrongExtension = true
    } else {
      this.isWrongExtension = false
    }
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

    if (!this.eventForm.name || !this.eventForm.date || !this.eventForm.description
      || !this.eventForm.location.street || !this.eventForm.location.city || !this.eventForm.location.state) {
      alert("Please fill out the form")
      return
    }
    this.eventForm.photo = this.selectedFile;

    console.log("eventForm: " + JSON.stringify(this.eventForm));

    //call eventService and then store the event info to the MongoDB
    this.eventService.addtoEvents(this.eventForm)

  }

}
