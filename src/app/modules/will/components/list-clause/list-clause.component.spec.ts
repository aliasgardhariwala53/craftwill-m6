import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClauseComponent } from './list-clause.component';

describe('ListClauseComponent', () => {
  let component: ListClauseComponent;
  let fixture: ComponentFixture<ListClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
