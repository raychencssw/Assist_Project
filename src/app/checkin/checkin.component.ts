import { Component } from '@angular/core';
import { OtpService } from '../services/otp.service';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent {
  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  verified: boolean = false;

  constructor(private otpService: OtpService) {}

  sendOTP() {
    this.otpService.getOtp(this.email).subscribe(
      (response) => {
        this.otpSent = true;
        this.otp = response.otp;
        console.log(this.otp);
      },
      (error) => {
        this.otpSent = false;
        this.otp = '';
        console.log("otp sent failed")
      }
    );
  }

  verifyOTP() {
    // Logic to verify the OTP goes here.
    // You can use a service to validate the OTP, for example, an ApiService.

    // For this example, let's assume the OTP is verified successfully.
    this.verified = true;
  }

}
