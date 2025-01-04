import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { DashboardService } from '../dashboard.service';
import { Parent } from '../../core/models/parent.model';
import { SearchService } from '../../home/search.service';

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, RouterModule], // Incluye RouterModule en los imports
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css']
})
export class ParentsComponent implements OnInit {
  parents: Parent[] = [];
  deletes: Parent[] = [];
  adds: Parent[] = [];

  private dashboardService = inject(DashboardService);
  private searchService = inject(SearchService);

  constructor() {}

  ngOnInit(): void {
    this.dashboardService.parents$.subscribe((parents: Parent[]) => {
      this.deletes = [];
      this.adds = [];
      this.loadParentsTranslations(parents);
    });

    this.dashboardService.addToParents$.subscribe((data: any) => {
      if (this.parents.findIndex(p => p.idTerm === data.term.idEntry) !== -1) return;
      const parent: Parent = {
        idTerm: data.term.idEntry,
        term: data.term.entryName,
        translations: data.term.translationsString,
        creator: '',
        status: 'Available'
      };
      this.parents.push(parent);
      this.adds.push(parent);
    });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.parents = {
        deletes: this.deletes,
        adds: this.adds
      };
    });
  }

  delete(parent: Parent): void {
    this.parents.splice(this.parents.indexOf(parent), 1);
    if (!parent.creator) {
      this.adds.splice(this.adds.indexOf(parent), 1);
      return;
    }
    this.deletes.push(parent);
  }

  private async loadParentsTranslations(parents: Parent[]): Promise<void> {
    const requests = parents.map(p =>
      this.searchService.getEntries(p.idTerm).toPromise()
    );

    const results = await Promise.all(requests);

    parents.forEach((p, i) => {
      const translations: string[] = [];
      results[i].forEach((r: any) => {
        r.data.forEach((d: any) => {
          translations.push(d.EntryVisualization);
        });
      });
      p.translations = translations.join(',');
    });

    this.parents = parents;
  }
}
