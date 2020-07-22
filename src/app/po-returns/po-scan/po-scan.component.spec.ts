import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoScanComponent } from './po-scan.component';

describe('PoScanComponent', () => {
  let component: PoScanComponent;
  let fixture: ComponentFixture<PoScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
