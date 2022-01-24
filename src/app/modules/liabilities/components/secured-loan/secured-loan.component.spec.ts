import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredLoanComponent } from './secured-loan.component';

describe('SecuredLoanComponent', () => {
  let component: SecuredLoanComponent;
  let fixture: ComponentFixture<SecuredLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuredLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuredLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
