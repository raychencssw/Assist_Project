import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private topStudents: any = []
  private topSchools: any = []
  constructor() { }
  setTopStudents(students: any):void {
    this.topStudents = students;
  }

  getTopStudents() : any {
    return this.topStudents;
  }

  setTopSchools(schools: any) : void {
    this.topSchools = schools;
  }

  getTopSchools() : any {
    return this.topStudents;
  }
}
