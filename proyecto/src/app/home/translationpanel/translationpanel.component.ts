import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { VariantsComponent } from './variants/variants.component'; // Importa VariantsComponent
import { ExamplesComponent } from './examples/examples.component'; // Importa ExamplesComponent
import { SearchService } from '../search.service';

@Component({
    selector: 'app-translationpanel',
    imports: [
        CommonModule,
        MatCardModule,
        RouterModule,
        VariantsComponent, // Importa VariantsComponent
        ExamplesComponent // Importa ExamplesComponent
    ],
    templateUrl: './translationpanel.component.html',
    styleUrls: ['./translationpanel.component.css']
})
export class TranslationpanelComponent implements OnInit {
  public searchService = inject(SearchService);

  constructor() {}

  ngOnInit(): void {
    console.log('Translation Panel initialized');
  }
}
