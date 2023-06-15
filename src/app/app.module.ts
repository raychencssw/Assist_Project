import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { EventsComponent } from './events/events.component';
import { RankingsComponent } from './rankings/rankings.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './home/posts/posts.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { EventDetailsComponent } from './eventdetails/eventdetails.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes =[
  {path: '', component: HomeComponent},
  {path: 'events', component: EventsComponent },
  {path: 'rankings', component: RankingsComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EventsComponent,
    RankingsComponent,
    HomeComponent,
    PostsComponent,
    SignupComponent,
    LoginComponent,
    EventcreateComponent,
    EventDetailsComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTabsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    NgbTimepickerModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
