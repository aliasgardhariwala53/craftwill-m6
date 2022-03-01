import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPayoutComponent } from './select-payout.component';

describe('SelectPayoutComponent', () => {
  let component: SelectPayoutComponent;
  let fixture: ComponentFixture<SelectPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
