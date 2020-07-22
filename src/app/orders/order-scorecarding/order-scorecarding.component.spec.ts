import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderScorecardingComponent } from './order-scorecarding.component';

describe('OrderScorecardingComponent', () => {
  let component: OrderScorecardingComponent;
  let fixture: ComponentFixture<OrderScorecardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderScorecardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderScorecardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
