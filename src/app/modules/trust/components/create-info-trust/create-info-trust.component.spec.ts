import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfoTrustComponent } from './create-info-trust.component';

describe('CreateInfoTrustComponent', () => {
  let component: CreateInfoTrustComponent;
  let fixture: ComponentFixture<CreateInfoTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfoTrustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
