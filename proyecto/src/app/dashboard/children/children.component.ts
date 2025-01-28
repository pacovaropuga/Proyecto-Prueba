import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-children',
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
})
export class ChildrenComponent implements OnInit {
  children: any[] = [];
  p: number = 1;

  private dashboardService = inject(DashboardService);

  constructor() {}

  ngOnInit(): void {
    this.dashboardService.children$.subscribe((children) => {
      this.children = children;
    });
  }

  delete(entry: any): void {
    this.dashboardService.deleteEntry(entry.idEntry).subscribe(() => {
      this.children = this.children.filter((child) => child !== entry);
    });
  }
}
