import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PostServiceService } from '../post-service.service';
import {HttpClient} from '@angular/common/http';

interface LocationResponse {
  city: string;
  // Add other properties if necessary
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
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

  constructor(private postservice: PostServiceService, private renderer: Renderer2, private http: HttpClient){
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
  onSubmit(){
    if(this.postForm.invalid || this.isWrongExtension == true){
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
