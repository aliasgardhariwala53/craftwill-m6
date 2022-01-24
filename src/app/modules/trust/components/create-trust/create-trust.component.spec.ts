import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrustComponent } from './create-trust.component';

describe('CreateTrustComponent', () => {
  let component: CreateTrustComponent;
  let fixture: ComponentFixture<CreateTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
