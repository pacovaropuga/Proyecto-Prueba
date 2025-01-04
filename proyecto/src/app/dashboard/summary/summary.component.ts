import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { SearchService } from '../../home/search.service';
import { Parent } from '../../core/models/parent.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  terms$!: Observable<string>;
  parents$!: Observable<string>;
  entry!: any;

  // Cambiado a `public` para usarlo en la plantilla
  public dashboardService = inject(DashboardService);
  private searchService = inject(SearchService);

  get entries(): string {
    return this.entry?.data.map((d: any) => d.EntryVisualization).join(', ') || '';
  }

  ngOnInit(): void {
    this.dashboardService.term$.subscribe((entry: any) => {
      this.parents$ = this.searchService.getParents(entry.idEntry).pipe(
        tap((p: Parent[]) => this.dashboardService.parents$.next(p)),
        map((parent: Parent[]) => parent.map(p => p.term).join(', '))
      );

      this.terms$ = this.searchService.getVariants(entry.idEntry).pipe(
        tap(terms => this.dashboardService.children$.next(terms)),
        map((terms: any[]) => terms.map(t => t.entryName).join(', '))
      );

      this.entry = entry;
      console.log(this.entry);

      this.searchService.getEntries(this.entry.idEntry, '').subscribe(d => {
        console.log(d);
      });
    });
  }
}
