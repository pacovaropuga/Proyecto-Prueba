import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
