import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { Term } from '../../core/models/term.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-term',
  imports: [CommonModule, FormsModule], // Importamos FormsModule
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  term: Term;

  // Cambiado a público para permitir el acceso desde la plantilla
  public dashboardService = inject(DashboardService);

  constructor() {
    this.term = new Term();
    this.term.term = '';
  }

  ngOnInit(): void {
    this.dashboardService.selectedTerm$
      .pipe(filter(term => !!term))
      .subscribe(term => {
        console.log(term);
        this.term = term;
      });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.term = this.term;
    });
  }

  newEntry(): void {
    if (this.term.language && this.term.term) {
      // Usar el método setNewEntry en lugar de acceder directamente a .next()
      this.dashboardService.setNewEntry(this.term.term);
    }
  }
}
