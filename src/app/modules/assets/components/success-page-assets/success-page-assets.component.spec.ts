import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPageAssetsComponent } from './success-page-assets.component';

describe('SuccessPageAssetsComponent', () => {
  let component: SuccessPageAssetsComponent;
  let fixture: ComponentFixture<SuccessPageAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessPageAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
