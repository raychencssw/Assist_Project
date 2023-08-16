import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EventServiceService } from '../event-service.service';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {
  events: any[] = [];
  eventid = '';
  userid = '';
  curindex = 0;
  curevent = {
    name: '',
    date: '',
    start_time: {
      hour: '',
      minute: ''
    },
    end_time: {
      hour: '',
      minute: ''
    },
    location: {
      street: '',
      city: '', state: ''
    },
    description: ''
  }
  closeResult!: string;
  constructor(private http: HttpClient,
    private eventService: EventServiceService,
    private modalService: NgbModal,) { }

  ngOnInit() {
    const userId = JSON.parse(localStorage.getItem('user')!).id;
    this.userid = userId
    this.eventService.geteventsupervised(userId)
    this.fetchEvents();


  }
  fetchEvents() {
    this.http.get<any[]>('http://localhost:3080/supervisor/eventlist')
      .subscribe(events => {
        //1. if event.supervisor.length === 0, means no supervisor which needs to show in table
        //2. if event.supervisor.length>0, but the supervisor is this user, then show in table
        const filteredEvents = events.filter(event => {
          return event.supervisor.length === 0 || event.supervisor.includes(this.userid);
        });
        //sort date from the future to the past
        this.events = filteredEvents.sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());;

      }, error => {
        console.error(error);
      });
  }
  modalOption: NgbModalOptions = {};

  goToEventProfile(content: any, eventid: string, i: any) {
    this.eventid = eventid
    this.curindex = i
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.curevent = this.events[i]

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }


  }

  superviseEvent(event: any) {
    // Add your supervision logic here
    this.modalService.dismissAll(); //dismiss the modal
    //window.location.reload();//reload the page for data update

  }

  supervise_btn(eventId: String) {
    //const eventId = this.eventid; // Replace with the actual event ID
    const userId = JSON.parse(localStorage.getItem('user')!).id; // Replace with your user ID logic
    if (localStorage.getItem('supervisedEvents')) {
      const supervisedEvents = JSON.parse(localStorage.getItem('supervisedEvents')!);
      supervisedEvents.push(eventId);
      localStorage.setItem('supervisedEvents', JSON.stringify(supervisedEvents))
    }
    else {
      localStorage.setItem('supervisedEvents', JSON.stringify([eventId]))
    }
    this.eventService.superviseEventById(eventId, userId, 'true').subscribe();

  }
  unsupervise_btn(eventId: String) {

    const supervisedEvents = JSON.parse(localStorage.getItem('supervisedEvents')!);
    const filtered: string[] = []
    supervisedEvents.forEach((id: any) => {
      if (id !== eventId) {
        filtered.push(id);
      }
    });
    localStorage.setItem('supervisedEvents', JSON.stringify(filtered))
    const userId = JSON.parse(localStorage.getItem('user')!).id;
    this.eventService.superviseEventById(eventId, userId, 'false').subscribe();
    //console.log('successfully unsupervise')

  }
  isSupervised(eventId: String): boolean {
    const supervisedEvents = JSON.parse(localStorage.getItem('supervisedEvents') || '[]');
    return supervisedEvents.includes(eventId);
  }


}
