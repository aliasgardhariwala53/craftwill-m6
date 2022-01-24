import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrustComponent } from './list-trust.component';

describe('ListTrustComponent', () => {
  let component: ListTrustComponent;
  let fixture: ComponentFixture<ListTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTrustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
