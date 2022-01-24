import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLiabilitiesComponent } from './create-liabilities.component';

describe('CreateLiabilitiesComponent', () => {
  let component: CreateLiabilitiesComponent;
  let fixture: ComponentFixture<CreateLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLiabilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
