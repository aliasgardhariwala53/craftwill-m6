import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesPageTrustComponent } from './succes-page-trust.component';

describe('SuccesPageTrustComponent', () => {
  let component: SuccesPageTrustComponent;
  let fixture: ComponentFixture<SuccesPageTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccesPageTrustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesPageTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
