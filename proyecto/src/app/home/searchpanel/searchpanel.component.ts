import { Component, OnInit, signal } from '@angular/core';
import { SearchService } from '../search.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject } from 'rxjs';

interface Word {
  idTerm: number;
  term: string;
  language: string;
}

@Component({
  selector: 'app-searchpanel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './searchpanel.component.html',
  styleUrls: ['./searchpanel.component.css'],
})
export class SearchpanelComponent implements OnInit {
  autocompleteTermino = new FormControl('');
  words$!: Observable<Word[]>; // Observable tipado
  icon = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
            <defs>
              <style>.cls-1{fill:#ffffff;}</style>
            </defs>
            <title>x</title>
            <path class="cls-1" d="M120.5891,106.37506,96.5609,80.39355l-3.842,3.8457-4.35187-4.35187c.33368-.43195.667-.864.98346-1.30475A46.77661,46.77661,0,1,0,77.87956,89.85687q.99472-.68619,1.955-1.42987l4.34509,4.345-4.31427,4.31409,26.5097,23.5246a10.0585,10.0585,0,1,0,14.21405-14.23566ZM74.21977,74.22931a32.4793,32.4793,0,1,1,9.48859-22.94189A32.48241,32.48241,0,0,1,74.21977,74.22931Z"/>
          </svg>`;
word: any;

  constructor(
    private searchService: SearchService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.iconRegistry.addSvgIconLiteral('search', this.sanitizer.bypassSecurityTrustHtml(this.icon));
  }

  ngOnInit(): void {
    // Escuchar parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      const word = params.get('word');
      if (word) {
        this.searchService.filter(word).subscribe({
          next: (res: Word[]) => {
            const selected = res.find((r) => r.term === word);
            if (selected) {
              this.seleccionarTermino(selected);
            }
          },
          error: (err) => console.error('Error fetching filtered words:', err),
        });
      }
    });

    // Actualización del control reactivo
    this.autocompleteTermino.valueChanges
      .pipe(
        debounceTime(500),
        filter((word) => typeof word === 'string' && word.length > 0)
      )
      .subscribe({
        next: (word: string | null) => {
          if (word) {
            console.log('Searching for:', word);
            this.words$ = this.searchService.filter(word);
          }
        },
        error: (err) => console.error('Error fetching autocomplete suggestions:', err),
      });
  }

  seleccionarTermino(option: Word) {
    console.log('Selected:', option);
    this.searchService.entryLanguage = option.language;
    this.searchService.getEntries(option.idTerm, option.term).subscribe({
      next: (entries) => {
        this.searchService.entries$.next(entries);
      },
      error: (err) => console.error('Error fetching entries:', err),
    });
  }

  displayFn(term: Word): string {
    return term?.term || '';
  }
}
