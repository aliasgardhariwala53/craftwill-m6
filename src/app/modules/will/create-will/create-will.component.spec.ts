import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWillComponent } from './create-will.component';

describe('CreateWillComponent', () => {
  let component: CreateWillComponent;
  let fixture: ComponentFixture<CreateWillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
