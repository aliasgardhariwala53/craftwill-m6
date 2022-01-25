import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPastWillsComponent } from './list-past-wills.component';

describe('ListPastWillsComponent', () => {
  let component: ListPastWillsComponent;
  let fixture: ComponentFixture<ListPastWillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPastWillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPastWillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
