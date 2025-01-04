import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChildrenComponent } from './children/children.component';
import { ExamplesCrudComponent } from './examples-crud/examples-crud.component';
import { ParentsComponent } from './parents/parents.component';
import { VariantsCrudComponent } from './variants-crud/variants-crud.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SearchComponent } from './search/search.component';
import { SearchParentsComponent } from './search-parents/search-parents.component';
import { SearchVariantComponent } from './search-variant/search-variant.component';
import { SummaryComponent } from './summary/summary.component';
import { TermComponent } from './term/term.component';
import { TermsCrudComponent } from './terms-crud/terms-crud.component';
import { TranslationsComponent } from './translations/translations.component';
import { SearchTranslationComponent } from './search-translation/search-translation.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    ChildrenComponent,
    ExamplesCrudComponent,
    ParentsComponent,
    VariantsCrudComponent,
    SearchComponent,
    SearchParentsComponent,
    SearchVariantComponent,
    SummaryComponent,
    TermComponent,
    TermsCrudComponent,
    TranslationsComponent,
    SearchTranslationComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    console.log('Dashboard initialized');
  }

  save(): void {
    this.dashboardService.save$.next();

    setTimeout(() => {
      this.dashboardService.save()
        .pipe(
          catchError(e => {
            console.error('Error during save:', e);
            alert('Algo falló');
            return throwError(() => e);
          })
        )
        .subscribe(() => {
          alert('Todo guardado');
        });
    }, 100);
  }
}
