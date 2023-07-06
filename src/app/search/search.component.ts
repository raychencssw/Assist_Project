import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchServiceService } from '../services/search-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchText!: string;
  searchResults: string[] = [];
  events: string[] = [];
  users: string[] = [];
  selectedOption!: string;
  searchControl = new FormControl();
  getUsersProfile: any;
  profileId: string = "";
  constructor(private http: HttpClient,
    private router: Router,
    private searchService: SearchServiceService) { }

  handleOptionChange() {
    this.searchControl.reset();
    this.searchResults = [];

    if (this.selectedOption === 'option1') {
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            this.searchResults = [];
            return ([]);
          } else {
            return this.searchService.fetchAutocompleteData1(value); //changed
          }
        }
        )

      ).subscribe((data) => {
        this.searchResults = data
      });
    } else if (this.selectedOption === 'option2') {
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value) {
            this.searchResults = [];
            return ([]);
          } else {
            return this.searchService.fetchAutocompleteData2(value);//changed
          }
        }

        )
      ).subscribe((data) => {
        this.searchResults = data
      });
    }

  }

  /*fetchAutocompleteData1(value: string): Observable<string[]> {
    const backendUrl1 = 'http://localhost:3080/usersearch';
    return this.http.get<string[]>(backendUrl1).pipe(
      map(response => response.map(item => item.toString()) //the response data array converted to a string. 
        .map(item => item.toString())
        .filter(result => result.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10)//keep only 10 results at most 
      )
    );
  }

  fetchAutocompleteData2(value: string): Observable<string[]> {
    const backendUrl2 = 'http://localhost:3080/eventsearch';
    return this.http.get<string[]>(backendUrl2).pipe(
      map(response => response.map(item => item.toString())
        .map(item => item.toString())
        .filter(result => result.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10)//keep only 10 results at most 
      )
    );

  }*/
  navigateToProfile(result: any) {
    if (this.selectedOption === 'option1') {
      this.searchService.searchuser(result).subscribe(profile => {
        this.getUsersProfile = profile;
        this.profileId = this.getUsersProfile["_id"];
        var profile_url = "profile/" + this.profileId
        location.href = profile_url //browser perform a full page reload

      });
    }
    else {
      this.router.navigate([`/events`])
    }

  }

}

