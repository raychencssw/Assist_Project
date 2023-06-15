import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { EventDetailsComponent } from './eventdetails/eventdetails.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { EventsComponent } from './events/events.component';


const routes: Routes = [
  { path: 'qrscanner', component: QrscannerComponent},
  { path: 'eventdetails', component: EventDetailsComponent},
  { path: 'eventcreate', component: EventcreateComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'events', component: EventsComponent},
  { path: 'event-detail/:id', component: EventDetailsComponent },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
