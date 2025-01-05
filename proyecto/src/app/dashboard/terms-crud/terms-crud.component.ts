import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { Entry } from '../../core/models/entry.model';

export interface Status {
  id: number;
  name: string;
  class: string;
}

@Component({
    selector: 'app-terms-crud',
    imports: [FormsModule, CommonModule], // Importamos FormsModule y CommonModule
    templateUrl: './terms-crud.component.html',
    styleUrls: ['./terms-crud.component.css']
})
export class TermsCrudComponent implements OnInit {
  statuses: Status[] = [
    { id: 1, name: 'available', class: 'success' },
    { id: 2, name: 'not available', class: 'danger' },
    { id: 3, name: 'revision', class: 'warning' },
  ];
  status = this.statuses[0];
  entry: Entry;

  constructor(private dashboardService: DashboardService) {
    this.entry = new Entry();
  }

  ngOnInit(): void {
    this.dashboardService.term$.subscribe((t: any) => {
      if (!t) return;
      this.entry = t;
      console.log(this.entry);
    });

    this.dashboardService.newEntry$.subscribe((entry) => {
      if (!entry) return;
      this.entry = new Entry();
      this.entry.entryName = entry;
      console.log(this.entry);
    });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.entry = this.entry;
    });
  }

  deleteAudio(type: 'audioEnglish' | 'audioUSA'): void {
    if (type === 'audioEnglish') {
      this.entry.audioEnglish = ''; // Elimina el enlace del audio inglés
    } else if (type === 'audioUSA') {
      this.entry.audioUSA = ''; // Elimina el enlace del audio USA
    }
  }

  uploadAudio(event: Event, type: 'audioEnglish' | 'audioUSA'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'audioEnglish') {
          this.entry.audioEnglish = reader.result as string; // Guarda el enlace del audio inglés
        } else if (type === 'audioUSA') {
          this.entry.audioUSA = reader.result as string; // Guarda el enlace del audio USA
        }
      };
      reader.readAsDataURL(file); // Convierte el archivo en un enlace base64
    }
  }

  changeTerm(): void {
    // Lógica para cambiar el término, como reiniciar el término o cargar uno nuevo
    this.entry = new Entry();
    console.log('Term has been changed');
  }
}
