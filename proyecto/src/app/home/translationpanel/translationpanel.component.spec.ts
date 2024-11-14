import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationpanelComponent } from './translationpanel.component';

describe('TranslationpanelComponent', () => {
  let component: TranslationpanelComponent;
  let fixture: ComponentFixture<TranslationpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
