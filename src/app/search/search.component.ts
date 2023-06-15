import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText!: string;
  searchResults: string[] = [];
  events: string[] = [];

  constructor(private http: HttpClient) {
    this.onSearch = this.onSearch.bind(this);
  }

  ngOnInit(): void { }

  onSearch() {
    const backendUrl = 'http://localhost:3080/eventsearch';
    this.http.get<any>(backendUrl).subscribe((data) => {
      this.events = data;
      console.log("data", data);
      this.searchResults = this.events
        .filter((result) =>
          result.toLowerCase().includes(this.searchText.toLowerCase())
        )
        .slice(0, 10);//keep only 10 results at most 
    });
  }

  debounce(func: Function, delay: number) {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  onInputChange() {
    const debouncedSearch = this.debounce(this.onSearch, 300);
    debouncedSearch();
  }
}