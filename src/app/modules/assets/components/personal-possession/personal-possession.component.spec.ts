import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPossessionComponent } from './personal-possession.component';

describe('PersonalPossessionComponent', () => {
  let component: PersonalPossessionComponent;
  let fixture: ComponentFixture<PersonalPossessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalPossessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPossessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
