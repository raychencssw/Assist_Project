import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


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

  constructor(private http: HttpClient) { }

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
            return this.fetchAutocompleteData1(value);
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
            return this.fetchAutocompleteData2(value);
          }
        }

        )
      ).subscribe((data) => {
        this.searchResults = data
      });
    }
  }

  fetchAutocompleteData1(value: string): Observable<string[]> {
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

  }
}

