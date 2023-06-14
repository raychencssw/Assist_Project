import { Component, OnInit} from '@angular/core';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {
  topStudents: any[] = [];
  topSchools: any[] = [];

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.topStudents = this.rankingService.getTopStudents();
    this.topSchools = this.rankingService.getTopSchools();
  }

  /*
  fetchTopStudents() {
    this.rankingService.getTopStudents()
      .subscribe((students: any[]) => {
        this.topStudents = students;
      });
  }

  fetchTopSchools() {
    this.rankingService.getTopSchools()
      .subscribe((schools: any[]) => {
        this.topSchools = schools;
      });
  }
  */
}
