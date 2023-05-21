import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { EventdetailsComponent } from './eventdetails/eventdetails.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';

const routes: Routes = [
  { path: 'qrscanner', component: QrscannerComponent},
  { path: 'eventdetails', component: EventdetailsComponent},
  { path: 'eventcreate', component: EventcreateComponent},
  { path: 'profile', component: ProfileComponent}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
