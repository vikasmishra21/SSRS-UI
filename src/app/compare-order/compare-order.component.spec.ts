import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareOrderComponent } from './compare-order.component';

describe('CompareOrderComponent', () => {
  let component: CompareOrderComponent;
  let fixture: ComponentFixture<CompareOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
