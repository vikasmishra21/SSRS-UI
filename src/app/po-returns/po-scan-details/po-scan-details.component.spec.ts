import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoScanDetailsComponent } from './po-scan-details.component';

describe('PoScanDetailsComponent', () => {
  let component: PoScanDetailsComponent;
  let fixture: ComponentFixture<PoScanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoScanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoScanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
