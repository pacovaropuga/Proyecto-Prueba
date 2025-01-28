import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';

@Component({
    selector: 'app-examples', // Configuración standalone
    imports: [CommonModule], // Eliminamos HttpClientModule, ya que no es necesario
    templateUrl: './examples.component.html',
    styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit {
  @Input() idEntry!: number; // Declaramos el Input como requerido
  examples$!: Observable<any>;
  display = false;

  // Inyección de HttpClient con la API inject
  private http = inject(HttpClient);

  constructor() {}

  ngOnInit(): void {
    if (!this.idEntry) {
      console.error('idEntry no proporcionado.');
      return;
    }

    this.examples$ = this.http.get(`${environment.API}/api/examples`, {
      params: {
        idEntry: this.idEntry.toString()
      }
    });
  }
}
