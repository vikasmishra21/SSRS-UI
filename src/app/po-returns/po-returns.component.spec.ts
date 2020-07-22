import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReturnsComponent } from './po-returns.component';

describe('PoReturnsComponent', () => {
  let component: PoReturnsComponent;
  let fixture: ComponentFixture<PoReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
