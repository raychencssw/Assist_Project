import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit{
  @ViewChild('video') video: any;
  videoUrl?: SafeResourceUrl;
  constructor(private router: Router, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/production_id_4508061 (1080p).mp4');
  }

  redirectSignup(){
    this.router.navigate(['signup'])
  }
  redirectLogin(){
    this.router.navigate(['login'])
  }
  
}
