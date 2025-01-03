import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination'; // Biblioteca de paginación
import { DashboardService } from '../dashboard.service'; // Servicio necesario

@Component({
  selector: 'app-children',
  standalone: true, // Componente standalone
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule // Para paginación
  ],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class ChildrenComponent implements OnInit {
  children: any[] = []; // Datos de los niños
  p: number = 1; // Página actual

  private dashboardService = inject(DashboardService);

  constructor() {}

  ngOnInit(): void {
    // Subscribirse a los datos del servicio
    this.dashboardService.children$.subscribe(children => {
      console.log(children);
      this.children = children;
    });
  }

  delete(entry: any): void {
    // Eliminar entrada
    this.dashboardService.deleteEntry(entry.idEntry).subscribe(() => {
      this.children.splice(this.children.indexOf(entry), 1);
    });
  }
}
