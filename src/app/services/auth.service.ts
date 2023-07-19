import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private user: any = []; // Define a private property to store the user object
  private isLoggedIn = false;
  private token: any
  userJson: any
  postJson: any
  followingJson: any
  notificationJson: any
  loginResponse = new BehaviorSubject<any>(this.user['token'])
  authResponse = new Subject<any>()

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedIn = this.checkAuthenticationStatus();
  }

  ngOnInit(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }

  }


  loginUser(userDetails: any): Promise<boolean> {
    // Define the endpoint URL
    const url = 'http://localhost:3080/login';
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Send the POST request
        this.http.post(url, userDetails).subscribe({
        next: (response) => {
        // Stores the user object in auth service
          this.user = response;
          console.log(this.user)
          this.token = this.user['token']
          this.setAuthToken(this.token);
          this.isLoggedIn = true
          this.loginResponse.next(true);
          this.startTokenExpiration()
          this.setUser(this.user)
          this.router.navigate(['/home']);
      },
      error: (error) => {
        // Handle any errors
        console.error(error);
        alert("Please enter a valid email and password");
        this.router.navigate(['/login']);
      }

        });
        resolve(true)
      }, 1000)
    })

  }

  startTokenExpiration() {
    const expirationTime = 60 * 60 * 1000;
  }


  setUser(user: any): void {
    console.log(this.user)
    const tempUser = user.user
    const userDetails = {
      id: tempUser._id,
      email: tempUser.email,
      firstName: tempUser.firstname,
      lastName: tempUser.lastname,
      eventsAttended: tempUser.eventsAttended,
      followers: tempUser.followers,
      following: tempUser.following,
      notifications: tempUser.notifications,
      points: tempUser.points,
      userName: tempUser.username,
      school: tempUser.school,
      posts: tempUser.posts,
      likedPosts: tempUser.likedposts,
      profilepicture: tempUser.profilepicture
    }
    const userString = JSON.stringify(userDetails)
    localStorage.setItem('user', userString)
    this.setLikedPosts(tempUser.likedposts)
    this.setFollowing(tempUser.following)
    this.setNotifications(tempUser.notifications)
  }
  private setAuthToken(token: string): void {
    localStorage.setItem('token', token);
    console.log(localStorage)
  }
  setLikedPosts(userPosts: any) {
    console.log(userPosts)
    const postString = JSON.stringify(userPosts)
    localStorage.setItem('likedposts', postString)
  }
  getLikedPosts() {
    const likedString = localStorage.getItem('likedposts')
    if (likedString) {
      this.postJson = JSON.parse(likedString)
    }
    return this.postJson
  }
  setFollowing(following: any){
    const followingString = JSON.stringify(following)
    localStorage.setItem('following', followingString)
  }
  getFollowing(){
    const followingString = localStorage.getItem('following')
    if(followingString){
      this.followingJson = JSON.parse(followingString)
    }
    return Array.isArray(this.followingJson) ? this.followingJson : [this.followingJson];
  }
  setNotifications(notifications: any){
    const notString = JSON.stringify(notifications)
    localStorage.setItem('notifications', notString)
    console.log(localStorage)
  }
  getNotifications(){
    const notString = localStorage.getItem('notifications')
    if(notString){
      this.notificationJson = JSON.parse(notString)
    }
    return Array.isArray(this.notificationJson) ? this.notificationJson : [this.notificationJson];
  }


  getAuthToken(): string | null {
    console.log(localStorage.getItem('token'))
    return localStorage.getItem('token');
  }
  private clearAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.clear()
  }
  checkAuthenticationStatus(): boolean {
    const authToken = this.getAuthToken();
    return !!authToken; // Convert the token to a boolean value
  }

  getUser(): Observable<any> {
    return of(localStorage.getItem('token')); // Retrieve the stored user object
  }

  findUser() {
    const userString = localStorage.getItem('user')
    if (userString) {
      this.userJson = JSON.parse(userString)
    }
    return this.userJson
  }
  findUserLikedPosts() {

    const userString = localStorage.getItem('user')
    if (userString) {
      this.userJson = JSON.parse(userString)
      console.log(this.userJson)
    }
    return this.userJson.likedPosts
  }

  clearUser(): void {
    this.user = null; // Clear the user object
    localStorage.removeItem('user');
    localStorage.clear()
  }
  isAuthenticated(): boolean {
    var getToken = this.getAuthToken()
    if (getToken) {
      this.loginResponse.next(true)
      return true
    }
    this.loginResponse.next(false)
    return false;
  }

  isLoggedInUser() {
    return this.user
  }



  logout(): void {
    this.http.get(`http://localhost:3080/logout`).subscribe((response) => {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.clearAuthToken();
      this.clearUser()
      this.user = null
      this.loginResponse.next(false)
    })

  }
}