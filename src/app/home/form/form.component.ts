import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PostServiceService } from 'src/app/services/post-service.service';
import {HttpClient} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface LocationResponse {
  city: string;
  // Add other properties if necessary
}

interface googleLocation {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
  status: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  @ViewChild('locationCheckBox') locationCheckBox?: ElementRef
  @ViewChild('locationInput') locationInput?: ElementRef;
  @ViewChild('locationDiv') locationDiv?: ElementRef;
  public isChecked: boolean = false
  selectedFile: File | null = null
  fileExtension: any = ""
  fileName: any = ""
  isWrongExtension: boolean = false
  formData: any
  postForm: FormGroup;

  constructor(private postservice: PostServiceService, private renderer: Renderer2, private http: HttpClient, private toastr: ToastrService){
    this.postForm = new FormGroup({
      'posttext': new FormControl('', Validators.required),
      'postlocation': new FormControl('', Validators.required),
      'autolocation': new FormControl(false),
      'photo': new FormControl(null, Validators.required)
    })
  }
  ngOnInit(): void {
    
  }
  
  checkChecked(){
    this.isChecked = this.locationCheckBox?.nativeElement.checked
    if(this.isChecked == true){
      this.postForm.get('postlocation')?.setValue(null)
      // this.renderer.removeChild(this.locationDiv.nativeElement, this.locationInput.nativeElement)
      this.postForm.get('postlocation')?.disable()
    }else{
      this.renderer.appendChild(this.locationDiv?.nativeElement, this.locationInput?.nativeElement)
      this.postForm.get('postlocation')?.enable()
    }
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0] as File
    if(this.selectedFile){
      this.fileName = this.selectedFile.name
      this.fileExtension = this.fileName.split('.').pop()
      console.log(this.fileName)
      console.log(this.fileExtension)
      if(this.fileExtension !== 'jpeg' && this.fileExtension !== 'jpg' && this.fileExtension !== 'png'){
        this.isWrongExtension = true
      }else{
        this.isWrongExtension = false
      }
      // this.postForm.get('photo')?.setValue(this.selectedFile)
    }

  }
  onSubmit(){
    if(this.postForm.invalid || this.isWrongExtension == true){
      this.toastr.error('Please choose correct File Type', 'File Error')
      return
    }
    if(this.isChecked){
      this.formData = new FormData()
      this.http.get<LocationResponse>('https://ipinfo.io/json?token=1958320ba3c283').subscribe(responseData=>{
        console.log(responseData['city'])
        this.formData.append('description', this.postForm.get('posttext')?.value)
        this.formData.append('location', responseData['city'] as string)
        this.formData.append('photo', this.selectedFile)
        this.postservice.addtoPosts(this.formData)
        this.postForm.reset()
        this.postForm.get('postlocation')?.enable()
      })
    }else{
      this.formData = new FormData()
      const tempLoc = this.postForm.get('postlocation')?.value
      this.http.get<googleLocation>(`https://maps.googleapis.com/maps/api/geocode/json?address=${tempLoc}&key=AIzaSyAS2E85adysbVfdqUldzQHR1uIHEzT9vGc`).subscribe(response=>{
        if(response['status'] == 'ZERO_RESULTS'){
          this.toastr.error('Please provide a valid location', 'Location Error')
          return
        }else{
          console.log(response.results[0].address_components[0].long_name)
          this.formData.append('description', this.postForm.get('posttext')?.value)
          this.formData.append('location', response.results[0].address_components[0].long_name as string)
          this.formData.append('photo', this.selectedFile)
          this.postservice.addtoPosts(this.formData)
          this.postForm.reset()
        }
      })
    }
  }

  // fileTypeValidator: ValidatorFn = (control: AbstractControl) => {
  //   const file = control.value as File;
  //   if (file) {
  //     const fileType = file.type;
  //     if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType != 'image/jpg') {
  //       return { invalidFileType: true };
  //     }
  //   }
  //   return null;
  // };

}
