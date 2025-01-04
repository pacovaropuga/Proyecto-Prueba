import { Component } from '@angular/core';
import { Variant } from '../../core/models/variant.model';
import { DashboardService } from '../dashboard.service';
import { EditVariantComponent } from './edit-variant/edit-variant.component';
import { Status } from '../terms-crud/terms-crud.component';
import { statuses } from '../examples-crud/edit/edit.component';
import { SearchService } from '../../home/search.service';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-variants-crud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variants-crud.component.html',
  styleUrls: ['./variants-crud.component.css']
})
export class VariantsCrudComponent {
  variants: Variant[] = [];
  deletes: Variant[] = [];
  adds: Variant[] = [];
  statuses: Status[] = statuses;
  bsModalRef: BsModalRef | undefined;

  constructor(
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.dashboardService.addToVariants$.subscribe((variant: Variant) => {
      if (this.variants.findIndex(v => v.idVariant === variant.idVariant) !== -1) return;
      this.variants.push(variant);
      this.adds.push(variant);
    });

    this.dashboardService.term$.subscribe((t: any) => {
      this.searchService.findVariantsByIdEntry(t.idEntry).subscribe((variants: Variant[]) => {
        this.variants = variants;
        this.deletes = [];
        this.adds = [];
      });
    });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.variants = {
        deletes: this.deletes,
        adds: this.adds,
        variants: this.variants.filter(v => v.idEntry)
      };
    });

    this.dashboardService.newEntry$.subscribe((entry: string) => {
      this.adds = [];
      this.deletes = [];
      this.variants = [
        {
          variant: entry,
          grammar: '',
          idVariant: undefined,
          creator: undefined,
          idStatus: 1
        }
      ];
      this.adds.push(this.variants[0]);
    });
  }

  add(variant: string, grammar: string): void {
    if (!variant.length || this.variants.map(v => v.variant).includes(variant)) return;
    const newVariant: Variant = { variant, grammar };
    this.variants.push(newVariant);
    this.adds.push(newVariant);
  }

  edit(variant: Variant): void {
    const initialState = { variant: JSON.parse(JSON.stringify(variant)) };
    this.bsModalRef = this.modalService.show(EditVariantComponent, { initialState });
    this.bsModalRef.content.saveCallback = (updatedVariant: Variant) => {
      const index = this.variants.indexOf(variant);
      this.variants.splice(index, 1, updatedVariant);
    };
  }

  status(id: number): string | undefined {
    return this.statuses.find(e => e.id === id)?.name;
  }

  delete(variant: Variant): void {
    if (variant.idEntry) {
      this.deletes.push(variant);
    } else {
      const index = this.adds.indexOf(variant);
      if (index !== -1) this.adds.splice(index, 1);
    }
    const variantIndex = this.variants.indexOf(variant);
    this.variants.splice(variantIndex, 1);
  }

  deleteAll(): void {
    this.deletes.push(...this.variants.filter(v => v.idEntry));
    this.variants = [];
    this.adds = [];
  }
}
