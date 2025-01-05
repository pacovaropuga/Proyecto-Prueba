import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime, filter } from 'rxjs/operators';
import { SearchService } from '../../home/search.service';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-search-parents',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatOptionModule
    ],
    templateUrl: './search-parents.component.html',
    styleUrls: ['./search-parents.component.css']
})
export class SearchParentsComponent implements OnInit {
  words$: any;
  autocompleteTermino = new FormControl();
  idTerm: any = '';
  selected: any;
  entries: any;

  private searchService = inject(SearchService);
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.autocompleteTermino.valueChanges
      .pipe(
        debounceTime(500),
        filter(word => word.length > 0)
      )
      .subscribe(word => {
        this.words$ = this.searchService.filter(word, this.dashboardService.language);
      });
  }

  displayFn(term: any): string {
    return term?.term || '';
  }

  addTo(term: any, index: number): void {
    this.dashboardService.addToParents$.next({
      term,
      index
    });
  }

  seleccionarTermino(option: any): void {
    this.selected = option;
    this.searchService.getEntries(option.idTerm, option.term).subscribe((r: any) => {
      r.forEach((d: any) => {
        d.translationsString = d.data.map((entry: any) => entry.EntryVisualization).join(',');
      });
      this.entries = r;
      console.log(this.entries);
    });
  }
}
