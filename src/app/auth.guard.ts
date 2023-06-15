import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard{
  constructor(private authService: AuthService, private router: Router) {}
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const user = this.authService.isLoggedInUser();
    
  //   if (user !== null) {
  //     return true;
  //   } else {
  //     //user is not authenticated
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
    
  // }
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isAuthenticated() == false) {
      this.router.navigate(['/login']);
      console.log(this.authService.isAuthenticated())
      return false;
    }else{
      // this.router.navigate(['/home']);
      console.log('here')
      return true
    }
  }
  
}
