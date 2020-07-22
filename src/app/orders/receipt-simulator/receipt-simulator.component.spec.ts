import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSimulatorComponent } from './receipt-simulator.component';

describe('ReceiptSimulatorComponent', () => {
  let component: ReceiptSimulatorComponent;
  let fixture: ComponentFixture<ReceiptSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
