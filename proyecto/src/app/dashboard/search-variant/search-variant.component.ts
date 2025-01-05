import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime, filter } from 'rxjs/operators';
import { SearchService } from '../../home/search.service';
import { DashboardService } from '../dashboard.service';
import { Variant } from '../../core/models/variant.model';

@Component({
    selector: 'app-search-variant',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatOptionModule
    ],
    templateUrl: './search-variant.component.html',
    styleUrls: ['./search-variant.component.css']
})
export class SearchVariantComponent implements OnInit {
  words$: any;
  autocompleteTermino = new FormControl();
  idTerm: any = '';
  selected: any;
  entries: any;
  variants: Variant[] = [];

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

  addTo(variant: Variant, index: number): void {
    variant.idEntry = undefined;
    this.dashboardService.addToVariants$.next(variant);
  }

  seleccionarTermino(option: any): void {
    this.selected = option;
    this.searchService.findVariantsByIdEntry(option.idTerm).subscribe((variants: Variant[]) => {
      this.variants = variants;
    });
  }
}
