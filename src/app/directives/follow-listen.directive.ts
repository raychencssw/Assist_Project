import { Directive, Renderer2, ElementRef } from '@angular/core';
import { ProfileService } from '../services/profile.service';
@Directive({
  selector: '[appFollowListen]'
})
export class FollowListenDirective {

  constructor(private renderer: Renderer2, private elementref: ElementRef, private profile:ProfileService) {
    this.renderer.listen(this.elementref.nativeElement, 'click', (event)=>{
      console.log(event.currentTarget.className)
      profile.getProfile(event.currentTarget.className)
    })
  }

}
