import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeResidualAssetComponent } from './distribute-residual-asset.component';

describe('DistributeResidualAssetComponent', () => {
  let component: DistributeResidualAssetComponent;
  let fixture: ComponentFixture<DistributeResidualAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributeResidualAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeResidualAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
