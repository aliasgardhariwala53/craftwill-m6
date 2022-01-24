import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageLiabilitiesComponent } from './success-page-liabilities.component';

describe('SuccessPageLiabilitiesComponent', () => {
  let component: SuccessPageLiabilitiesComponent;
  let fixture: ComponentFixture<SuccessPageLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessPageLiabilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
