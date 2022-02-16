import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewWillComponent } from './review-will.component';

describe('ReviewWillComponent', () => {
  let component: ReviewWillComponent;
  let fixture: ComponentFixture<ReviewWillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewWillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
