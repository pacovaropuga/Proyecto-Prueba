import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpanelComponent } from './searchpanel.component';

describe('SearchpanelComponent', () => {
  let component: SearchpanelComponent;
  let fixture: ComponentFixture<SearchpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
