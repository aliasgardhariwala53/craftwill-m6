import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsecuredLoanComponent } from './unsecured-loan.component';

describe('UnsecuredLoanComponent', () => {
  let component: UnsecuredLoanComponent;
  let fixture: ComponentFixture<UnsecuredLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsecuredLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsecuredLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
