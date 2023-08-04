import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetpasswordService } from '../services/resetpassword.service';
import { DomainValidationService } from '../services/domain-validation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';

  constructor(private router: Router, private resetPasswordService: ResetpasswordService, private domainValidate: DomainValidationService, private toastr: ToastrService){}
  async requestResetPassword() {
    const validDomain = this.domainValidate.validateEmailDomain(this.email)
    if(validDomain){
      this.resetPasswordService.requestReset(this.email).subscribe(
        () => {
          this.toastr.success('Password reset link is sent. Please check your inbox.')
          this.router.navigate(['/login']); // Redirect to a success page
        },
        (error: any) => {
          this.toastr.error('Invalid email address!')
        }
      );
    }else{
      this.toastr.error('Please enter a valid email address')
      return
    }
    
  }
}
