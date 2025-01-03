import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SearchService } from '../../search.service';
import { ExamplesComponent } from '../examples/examples.component'; // Importar ExamplesComponent

@Component({
  selector: 'app-variants',
  standalone: true, // Configuración standalone
  imports: [CommonModule, ExamplesComponent], // Importar ExamplesComponent
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.css']
})
export class VariantsComponent implements OnInit {
  @Input() idTerm!: number; // Declaramos el Input como requerido
  variants$!: Observable<any>;
  display = false;

  // Inyección del servicio SearchService usando inject
  private searchService = inject(SearchService);

  constructor() {}

  ngOnInit(): void {
    this.variants$ = this.searchService.getVariants(this.idTerm);
  }
}
