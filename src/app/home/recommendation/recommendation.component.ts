import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { RecommendationService } from 'src/app/services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit{
  recommendList: any = []
  constructor(private recommend: RecommendationService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.findUser()
    const id = user['id']
    this.recommend.getPeople(id)
    this.recommend.recommendResponse.subscribe(response=>{
      console.log(response)
      this.recommendList = response
    })
  }
  navigateToProfile(userid: any){
    this.router.navigate(['/profile', userid])
  }
}