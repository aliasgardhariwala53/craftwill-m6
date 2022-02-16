import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionAssetsComponent } from './distribution-assets.component';

describe('DistributionAssetsComponent', () => {
  let component: DistributionAssetsComponent;
  let fixture: ComponentFixture<DistributionAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
