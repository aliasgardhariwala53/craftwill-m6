import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateDebtComponent } from './private-debt.component';

describe('PrivateDebtComponent', () => {
  let component: PrivateDebtComponent;
  let fixture: ComponentFixture<PrivateDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateDebtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
