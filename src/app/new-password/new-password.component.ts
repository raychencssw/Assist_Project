import { Component, OnInit } from '@angular/core';
import { ResetpasswordService } from '../services/resetpassword.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit{
  pattern: any
  passwordForm!: FormGroup;
  errorMessage: string = ''
  token: any
  tokenExpired: boolean = false
  isLoading: boolean = true

  constructor(private resetPasswordService: ResetpasswordService, private formBuilder: FormBuilder, private activateRoute: ActivatedRoute, private router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      this.token = params.get("token")
      this.resetPasswordService.checkTokenExpiration(this.token).subscribe({
        next:(response)=>{
          setTimeout(()=>{
            this.tokenExpired = false
            this.isLoading = false
          }, 1000)
        },
        error:(err)=>{
          this.tokenExpired = true
          this.router.navigate(['/'])
        }
      })
    })
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[!@#$%^&*()_+\-=[\]{};:'"\|,.<>\/?])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/)]],
      'confirm-password': ['', Validators.required]
    });
  }

  onSubmit(){
    this.errorMessage = ''
    if(this.passwordForm.get('password')?.value != this.passwordForm.get('confirm-password')?.value){
      this.errorMessage = 'Password do not match'
      return
    }
    this.resetPasswordService.setnewPassword(this.token, this.passwordForm.get('password')?.value).subscribe({
      next:response=>{
        console.log(response)
        this.toastr.success('Password changed successfully!')
        this.isLoading = true
        setInterval(()=>{
          this.isLoading = false
          this.router.navigate(['/login'])
        }, 3000)
      },
      error: (err)=>{
        this.toastr.error('Internal server error. Please try again later!')
      }
    })
    this.passwordForm.reset()
  }
}
