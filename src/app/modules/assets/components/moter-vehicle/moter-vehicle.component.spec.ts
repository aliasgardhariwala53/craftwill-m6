import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoterVehicleComponent } from './moter-vehicle.component';

describe('MoterVehicleComponent', () => {
  let component: MoterVehicleComponent;
  let fixture: ComponentFixture<MoterVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoterVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoterVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
