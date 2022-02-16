import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointExecutorComponent } from './appoint-executor.component';

describe('AppointExecutorComponent', () => {
  let component: AppointExecutorComponent;
  let fixture: ComponentFixture<AppointExecutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointExecutorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointExecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
