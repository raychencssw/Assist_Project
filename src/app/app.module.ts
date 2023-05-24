import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms'

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { EventsComponent } from './events/events.component';
import { RankingsComponent } from './rankings/rankings.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './home/posts/posts.component';

const appRoutes: Routes =[
  {path: '', component: HomeComponent},
  {path: 'events', component: EventsComponent },
  {path: 'rankings', component: RankingsComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EventsComponent,
    RankingsComponent,
    HomeComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
