import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelectBoxComponent } from './edit-select-box.component';

describe('EditSelectBoxComponent', () => {
  let component: EditSelectBoxComponent;
  let fixture: ComponentFixture<EditSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSelectBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
