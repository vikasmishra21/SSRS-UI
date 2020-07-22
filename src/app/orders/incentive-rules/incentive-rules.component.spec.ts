import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveRulesComponent } from './incentive-rules.component';

describe('IncentiveRulesComponent', () => {
  let component: IncentiveRulesComponent;
  let fixture: ComponentFixture<IncentiveRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentiveRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
