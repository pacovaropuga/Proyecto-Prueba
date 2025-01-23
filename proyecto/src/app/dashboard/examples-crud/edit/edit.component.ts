import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { Translation } from '../../../core/models/trasnslation.model';
import { Example } from '../../../core/models/example.model';
import { Status } from '../../terms-crud/terms-crud.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';

// Exportamos los statuses para que estén disponibles globalmente
export const statuses: Status[] = [
  { id: 1, name: 'Available', class: 'success' },
  { id: 2, name: 'Not Available', class: 'danger' },
  { id: 3, name: 'Under Review', class: 'warning' }
];

@Component({
    selector: 'app-examples-crud',
    imports: [CommonModule, FormsModule, ModalModule], // Importamos los módulos necesarios
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  entry: any;
  translationSelected!: Translation;
  translations: Translation[] = [];
  originalExamples: Example[] = [];
  bsModalRef: any;
  showUndo = false;
  deletes: Example[] = [];
  statuses: Status[] = statuses;
  example: any = {};
  status: any = {};


  examples: Example[] = [];

  private dashboardService = inject(DashboardService);
  private modalService = inject(BsModalService);
  private changeDetector = inject(ChangeDetectorRef);

  constructor() {}

  private loadExamples(idEntry: number): void {
    this.dashboardService.getTranslations(idEntry).subscribe((t: any) => {
        t.forEach((d: any) => {
            this.examples.push({
                idExample: d.idExample as number,
                example: d.translation as string,
                idCreator: d.idCreator as number,
                translation: d.translation as string,
                idStatus: d.idStatus as number
            });
        });
    });
}


  getStatus(idStatus: number): string {
    return this.statuses.find(e => e.id === idStatus)?.name || '';
  }

  edit(exampleOriginal: Example): void {
    const initialState = {
      example: {
        example: exampleOriginal.example,
        translationExample: exampleOriginal.translationExample,
        idExample: exampleOriginal.idExample,
        idStatus: exampleOriginal.idStatus,
        translation: exampleOriginal.translation
      }
    };

    this.bsModalRef = this.modalService.show(EditComponent, { initialState });
    this.bsModalRef.content.saveCallback = (example: Example) => {
      this.examples.splice(this.examples.indexOf(exampleOriginal), 1, example);
    };
  }

  ngOnInit(): void {
    this.dashboardService.term$.subscribe(term => {
      this.entry = term;
      this.loadExamples(this.entry.idEntry);
      console.log(term);
    });

    this.dashboardService.translations$
      .pipe(
        tap(t => {
          if (!t.length) return;
          this.translationSelected = t[0];
        })
      )
      .subscribe(t => {
        this.translations = t;
        console.log(this.translations);
        setTimeout(
          () => (this.originalExamples = this.examples.map(t => JSON.parse(JSON.stringify(t)))),
          2000
        );
      });

    this.dashboardService.save$.subscribe(() => {
      this.dashboardService.dashboardData.examples = {
        deletes: this.deletes,
        examples: this.examples
      };
    });
  }
  save(): void {
    this.dashboardService.save();
    this.showUndo = false;
  }
  delete(example: Example): void {
    this.deletes.push(example);
    this.examples.splice(this.examples.indexOf(example), 1);
    this.showUndo = true;
  }

  add(e: string, t: string): void {
    const translation = this.translations.find(t => t.idTerm === this.translationSelected.idTerm);
    const example = new Example();
    if (translation) {
      example.translation = translation.translation;
    }
    example.example = e;
    example.translationExample = t;
    example.idStatus = 1;

    this.examples.push(example);
    this.showUndo = true;
  }

  addToAll(e: string, translation: string): void {
    this.translations.forEach(t => {
      const example = new Example();
      example.translation = t.translation;
      example.example = e;
      example.translationExample = translation;
      example.idStatus = 1;

      this.examples.push(example);
    });
    this.showUndo = true;
  }

  undo(): void {
    this.deletes = [];
    this.examples = this.originalExamples.map(t => JSON.parse(JSON.stringify(t)));
    this.showUndo = false;
  }

  selectTranslation(t: Translation): void {
    this.translationSelected = t;
  }
}
