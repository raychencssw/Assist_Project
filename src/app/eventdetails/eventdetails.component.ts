import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventServiceService } from '../event-service.service';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css']
})
export class EventDetailsComponent implements OnInit {
  
  event:any;

  constructor(
    private route:ActivatedRoute,                //allow the event detail page to access the URL parameter in the current path
    private eventService: EventServiceService,  
    ){}

    ngOnInit(){

      console.log("eventDetail!");

      const id:any = this.route.snapshot.paramMap.get('id');
      console.log("This event deatil with id: " + id + " is called!");

      this.eventService.getEventById(id).subscribe((data) => {
        this.event = data;
        console.log("eventDetail: " + JSON.stringify(this.event));
      });
    }
}
