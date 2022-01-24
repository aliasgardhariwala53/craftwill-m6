import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLiabilitiesComponent } from './list-liabilities.component';

describe('ListLiabilitiesComponent', () => {
  let component: ListLiabilitiesComponent;
  let fixture: ComponentFixture<ListLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLiabilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
