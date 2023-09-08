import { Component, OnInit} from '@angular/core';
import { OtpService } from '../services/otp.service';
import { CheckinService } from '../services/checkin.service';
import { ActivatedRoute } from '@angular/router';
import { EventServiceService } from '../event-service.service';
import { response } from 'express';
import { error } from 'console';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  eventId: string | null = null;
  email: string = '';
  hostEmail: string = '';
  inputOtp: string = '';
  otp: string = '';
  otpSent: boolean = false;
  verified: boolean = false;
  otpExpirationTime: number = 0;
  showCheckin: boolean = true;
  showQuestion: boolean = false;
  showEmail: boolean = false;
  showHost: boolean = false;
  isAPMember: boolean = false;
  event: any;
  selectedMood: string | null = null;


  isCheckedIn: boolean = false;
  isCheckedOut: boolean = false;

  constructor(private otpService: OtpService, private checkinService: CheckinService,  private route:ActivatedRoute,                //allow the event detail page to access the URL parameter in the current path
  private eventService: EventServiceService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    if(this.eventId != null) {
      this.eventService.getEventById(this.eventId).subscribe((data) => {
        this.event = data;
      });
    }
  }

  onCheckinButtonClick() {
    this.showCheckin = false;
    this.showQuestion = true;
  }

  showEmailQuestion() {
    this.showQuestion = false;
    this.isAPMember = true;
    this.showEmail = true;
  }

  showHostQuestion() {
    this.showQuestion = false;
    this.isAPMember = false;
    this.showHost = true;
  }

  sendOTP() {
    this.otpService.getOtp(this.email).subscribe(
      (response) => {
        this.otpSent = true;
        this.otp = response.otp;
        //Set the otp expiration time to 60 seconds
        this.otpExpirationTime = 60; 
        console.log(this.otp);

        const countdownInterval = setInterval(() => {
          this.otpExpirationTime--;
          if (this.otpExpirationTime <= 0) {
            clearInterval(countdownInterval);
            this.clearOtp();
          }
        }, 1000)
      },
      (error) => {
        this.otpSent = false;
        this.otp = '';
        console.log("otp sent failed")
      }
    );
  }

  //Verify if the otp matches with the one given
  verifyOTP() {
    console.log(this.otp)
    console.log(this.inputOtp)
    if (this.otp == this.inputOtp && this.inputOtp.length != 0) {
      // OTP is verified successfully
      console.log("verified!")
      if(this.isAPMember) {
        this.checkinUser()
      } else {
        this.checkinGuest()
      }
    } else {
      // OTP verification failed
      this.verified = false;
      console.log("unverified")
      //TODO: show a verify failed message to the user
    }
  }

  clearOtp() {
    this.otp = '';
  }

  //Check in the user
  checkinUser() {
    console.log("checking in this email: " + this.email)
    if(this.eventId !== null) {
      this.checkinService.checkin(this.email, this.eventId).subscribe(
        (response) => {
          this.isCheckedIn = true;
          console.log("check in successfully")
        },
        (error) => {
          //check in failed
          this.isCheckedIn = false
          console.log(error.error)
        }
      )
    } else {
      console.log("Event id is null")
    }
  }

  //Check in the user
  checkinGuest() {
    console.log("checking in this guest email: " + this.email)
    if(this.eventId !== null) {
      this.checkinService.guestCheckin(this.email, this.eventId, this.hostEmail).subscribe(
        (response) => {
          this.isCheckedIn = true;
          console.log("check in successfully")
        },
        (error) => {
          //check in failed
          this.isCheckedIn = false
          console.log(error.error)
        }
      )
    } else {
      console.log("Event id is null")
    }
  }

  checkout() {
    if(this.isAPMember) {
      this.checkoutUser()
    } else {
      this.checkoutGuest()
    }
  }

  //check out the user
  checkoutUser() {
    if(this.eventId !== null) {
      this.checkinService.checkout(this.email, this.eventId, this.selectedMood).subscribe(
        (response) => {
          this.isCheckedOut = true;
          console.log("Check out successfully")
        },
        (error) => {
          //checkout failed
          this.isCheckedOut =false;
          console.log(error)
        }
      )
    } else {
      console.log("Event id is null")
    }
  }

  //check out the guest
  checkoutGuest() {
    if(this.eventId !== null) {
      this.checkinService.guestCheckout(this.email, this.eventId, this.selectedMood).subscribe(
        (response) => {
          this.isCheckedOut = true;
          console.log("Check out successfully");
        },
        (error) => {
          //checkout failed
          this.isCheckedOut =false;
          console.log(error)
        }
      )
    } else {
      console.log("Event id is null")
    }
  }
}