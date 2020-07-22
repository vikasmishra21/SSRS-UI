import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseorderComponent } from './closeorder.component';

describe('CloseorderComponent', () => {
  let component: CloseorderComponent;
  let fixture: ComponentFixture<CloseorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
