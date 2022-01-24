import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountUserComponent } from './bank-account-user.component';

describe('BankAccountUserComponent', () => {
  let component: BankAccountUserComponent;
  let fixture: ComponentFixture<BankAccountUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
