import { Component, OnInit, inject } from '@angular/core';
import { Translation } from '../../../core/models/trasnslation.model';
import { Variant } from '../../../core/models/variant.model';
import { Status } from '../../terms-crud/terms-crud.component';
import { DashboardService } from '../../dashboard.service';
import { statuses } from '../../examples-crud/edit/edit.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-variant',
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-variant.component.html',
    styleUrls: ['./edit-variant.component.css']
})
export class EditVariantComponent implements OnInit {
  translations: Translation[] = [];
  translationSelected: Translation | null = null;

  variant!: Variant;

  statuses = statuses;
  status!: Status;

  saveCallback!: (variant: Variant) => void;

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.status = statuses.find((s) => s.id === this.variant.idStatus)!;
  }

  save(): void {
    if (this.status) {
      this.variant.idStatus = this.status.id;
      this.saveCallback(this.variant);
    }
  }

  selectTranslation(t: Translation): void {
    this.translationSelected = t;
  }
}
