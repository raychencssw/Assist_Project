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
import { ProfileComponent } from './profile/profile.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'events', component: EventsComponent, canActivate:[AuthGuard]},
  { path: 'rankings', component: RankingsComponent, canActivate:[AuthGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate:[AuthGuard]}
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
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTabsModule
    
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
