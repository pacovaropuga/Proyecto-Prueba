import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { Translation } from '../../core/models/trasnslation.model';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
    selector: 'app-translations',
    imports: [CommonModule, RouterModule],
    templateUrl: './translations.component.html',
    styleUrls: ['./translations.component.css'],
})
export class TranslationsComponent {
  translations: Translation[] = [];
  adds: Translation[] = [];
  deletes: Translation[] = [];

  constructor(private dashboardService: DashboardService) {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    this.dashboardService.term$.subscribe((entry: any) => {
      if (!entry) return;

      this.translations = [];
      this.adds = [];
      this.deletes = [];

      entry.data.forEach((d: any) => {
        const translation: Translation = {
          idTerm: d.idEntry,
          translation: d.EntryVisualization,
          creator: d.user || 'Unknown',
          status: d.status || 'Available',
        };
        this.translations.push(translation);
      });

      this.publishTranslations();
    });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.translations = {
        adds: this.adds,
        deletes: this.deletes,
      };
    });

    this.dashboardService.newEntry$.pipe(skip(1)).subscribe(() => {
      this.translations = [];
    });

    this.dashboardService.addTo$.subscribe((value: any) => {
      const translation: Translation = {
        idTerm: value.term.idEntry,
        translation: `${value.term.entryName}${value.index}`,
        status: 'Available',
        creator: 'Admin',
      };
      this.adds.push(translation);
      this.translations.push(translation);
      this.publishTranslations();
    });
  }

  private publishTranslations(): void {
    this.dashboardService.translations$.next(this.translations);
  }

  delete(translation: Translation): void {
    const entryAddIndex = this.adds.indexOf(translation);
    if (entryAddIndex >= 0) {
      this.adds.splice(entryAddIndex, 1);
    } else {
      this.deletes.push(translation);
    }
    this.translations.splice(this.translations.indexOf(translation), 1);
    this.publishTranslations();
  }

  moveUp(translation: Translation): void {
    const index = this.translations.indexOf(translation);
    if (index > 0) {
      [this.translations[index], this.translations[index - 1]] = [
        this.translations[index - 1],
        this.translations[index],
      ];
      this.publishTranslations();
    }
  }

  moveDown(translation: Translation): void {
    const index = this.translations.indexOf(translation);
    if (index < this.translations.length - 1) {
      [this.translations[index], this.translations[index + 1]] = [
        this.translations[index + 1],
        this.translations[index],
      ];
      this.publishTranslations();
    }
  }
}
