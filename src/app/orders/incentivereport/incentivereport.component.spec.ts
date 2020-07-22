import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivereportComponent } from './incentivereport.component';

describe('IncentivereportComponent', () => {
  let component: IncentivereportComponent;
  let fixture: ComponentFixture<IncentivereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentivereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
