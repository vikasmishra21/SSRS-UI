import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSamplesComponent } from './view-samples.component';

describe('ViewSamplesComponent', () => {
  let component: ViewSamplesComponent;
  let fixture: ComponentFixture<ViewSamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
