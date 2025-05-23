import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatListModule } from '@angular/material/list';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptor/auth.interceptor';


import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { SupervisorloginComponent } from './supervisorlogin/supervisorlogin.component';
import { ProfileComponent } from './profile/profile.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { FormComponent } from './home/form/form.component';
import { FollowingComponent } from './home/following/following.component';
import { FollowListenDirective } from './directives/follow-listen.directive';
import { NgForm } from '@angular/forms';
import { EventDetailsComponent } from './eventdetails/eventdetails.component';
import { SocketioService } from './services/socketio.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './auth.guard';

import { SearchComponent } from './search/search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RecommendationComponent } from './home/recommendation/recommendation.component';
import { InfoComponent } from './home/info/info.component';
import { LandingComponent } from './landing/landing.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { OrganizationSignupComponent } from './signup/organization-signup/organization-signup.component';
import { SupvisosignupComponent } from './signup/supvisosignup/supvisosignup.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { CheckinComponent } from './checkin/checkin.component';
import { SupervisorcheckinComponent } from './supervisorcheckin/supervisorcheckin.component';
import { LikedByModalComponent } from './liked-by-modal/liked-by-modal.component';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'rankings', component: RankingsComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'supervisorlogin', component: SupervisorloginComponent },
  { path: 'orgsignup', component: OrganizationSignupComponent },
  { path: 'supsignup', component: SupvisosignupComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'event-detail/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: '', component: LandingComponent },
  { path: 'supervisor', component: SupervisorComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'supervisorcheck/:eventId/:supervisorId', component: SupervisorcheckinComponent },

  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'event-detail/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: '', component: LandingComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'checkin/:eventId', component: CheckinComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },

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
    SupervisorloginComponent,
    EventcreateComponent,
    FormComponent,
    FollowingComponent,
    FollowListenDirective,
    ProfileComponent,
    EventDetailsComponent,
    SearchComponent,
    RecommendationComponent,
    InfoComponent,
    LandingComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    OrganizationSignupComponent,
    SupvisosignupComponent,
    SupervisorComponent,
    CheckinComponent,
    SupervisorcheckinComponent,
    LikedByModalComponent,
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
    InfiniteScrollModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbTimepickerModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    MatAutocompleteModule,
    MatInputModule,
  ],
  providers: [AuthGuard, SocketioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
