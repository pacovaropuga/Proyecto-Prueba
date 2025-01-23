import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime, filter } from 'rxjs/operators';
import { SearchService } from '../../home/search.service';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-search',
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatOptionModule
    ],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  words$: any;
  autocompleteTermino = new FormControl();
  entries: any[] = [];
  currentEntry: any = {};
  idTerm: any = '';
  entryNumber = new FormControl(1);

  private searchService = inject(SearchService);
  private dashboardService = inject(DashboardService);

  get entryNOfM(): string {
    if (!this.currentEntry) return ``;
    return `${this.entries.indexOf(this.currentEntry) + 1}/${this.entries.length}`;
  }

  ngOnInit(): void {
    this.autocompleteTermino.valueChanges
      .pipe(
        debounceTime(500),
        filter((word: string) => word.length > 0)
      )
      .subscribe(word => {
        if (typeof word === 'string') {
          this.words$ = this.searchService.filter(word);
        }
      });

    this.entryNumber.valueChanges.subscribe(v => {
      if (v === null || isNaN(v) || v > this.entries.length || v < 1) {
        this.currentEntry = null;
        return;
      }
      this.currentEntry = this.entries[v - 1];
      this.dashboardService.setTerm(this.currentEntry);
    });
  }

  changeEntryNumber(increment: number): void {
    const newValue = (this.entryNumber.value || 0) + increment;
    if (newValue < 1 || newValue > this.entries.length) return;
    this.entryNumber.setValue(newValue, { emitEvent: false });
    this.currentEntry = this.entries[newValue - 1];
    this.currentEntry.index = newValue;
    this.dashboardService.setTerm(this.currentEntry);
  }

  seleccionarTermino(option: any): void {
    this.idTerm = option.idTerm;
    this.dashboardService.language = option.language;

    this.searchService.getEntries(option.idTerm).subscribe((entries: any) => {
      this.entries = entries;
      this.currentEntry = entries[0];
      this.entryNumber.setValue(1, { emitEvent: false });
      this.dashboardService.setTerm(this.currentEntry);
    });
  }

  newTerm(): void {
    console.log('Nuevo término seleccionado');
    this.dashboardService.newTerm$.next(); // Notificar un nuevo término
  }

  // Método necesario para displayWith en el autocompletado
  displayFn(term: any): string {
    return term?.term || '';
  }
}
