import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { Translation } from '../../core/models/trasnslation.model';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-translations',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule,RouterModule], // Importa módulos necesarios como CommonModule
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css']
})
export class TranslationsComponent {
  translations: Translation[] = [];
  adds: Translation[] = [];
  deletes: Translation[] = [];

  constructor(private dashboardService: DashboardService) {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    // Suscripción a los cambios en el término seleccionado
    this.dashboardService._term$.subscribe((entry: any) => {
      if (!entry) return;

      // Reinicia las listas
      this.translations = [];
      this.adds = [];
      this.deletes = [];

      // Procesa las traducciones del término
      entry.data.forEach((d: any) => {
        const translation: Translation = {
          idTerm: d.idEntry,
          translation: d.EntryVisualization,
          creator: d.user || 'Unknown', // Valor por defecto para el creador
          status: d.status || 'Available', // Valor por defecto para el estado
        };
        this.translations.push(translation);
      });

      this.publishTranslations();
    });

    // Manejo del evento de guardar
    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.translations = {
        adds: this.adds,
        deletes: this.deletes,
      };
    });

    // Limpia las traducciones al crear una nueva entrada
    this.dashboardService.newEntry$.pipe(skip(1)).subscribe(() => {
      this.translations = [];
    });

    // Agregar nueva traducción
    this.dashboardService.addTo$.subscribe((value: any) => {
      const translation: Translation = {
        idTerm: value.term.idEntry,
        translation: `${value.term.entryName}${value.index}`,
        status: 'Available',
        creator: 'Admin', // Creador predeterminado
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
}
