import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventServiceService } from '../event-service.service';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css']
})
export class EventDetailsComponent implements OnInit {
  
  id:any;
  event:any;

  constructor(
    //allow the event detail page to access the URL parameter in the current path
    private route:ActivatedRoute,
    private eventService: EventServiceService,
    ){}

    ngOnInit(){

      console.log("eventDetail!");

      this.id = this.route.snapshot.paramMap.get('_id');
      console.log("This event deatil with id: " + this.id + " is called!");

      this.eventService.getEventById(this.id).subscribe((data) => {
        this.event = data;
        console.log("eventDetail: " + this.event);
      });
    }
}
