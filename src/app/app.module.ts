import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { EventsComponent } from './events/events.component';
import { RankingsComponent } from './rankings/rankings.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { EventdetailsComponent } from './eventdetails/eventdetails.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { MatTabsModule } from '@angular/material/tabs'; //ng add @angular/material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';   

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EventsComponent,
    RankingsComponent,
    ProfileComponent,
    EventdetailsComponent,
    EventcreateComponent,
    QrscannerComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
