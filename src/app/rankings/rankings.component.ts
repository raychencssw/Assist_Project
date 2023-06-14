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
    this.rankingService.fetchStudentData().subscribe(students => {
      this.topStudents = students;
    });

    this.rankingService.fetchSchoolData().subscribe(schools => {
      this.topSchools = schools;
    });
  }

  
}
