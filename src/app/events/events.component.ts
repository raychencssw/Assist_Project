import { Component, OnInit } from '@angular/core';
import { Event } from '../type'
import { weeklyEvents } from '../fake-data'
import { monthlyEvents } from '../fake-data'

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

  ngOnInit():void{
    this.weeklyEvents = weeklyEvents;
    this.monthlyEvents = monthlyEvents;
  }


  createEvent(){
    //createEvent code wait to be implemented
  }
}
