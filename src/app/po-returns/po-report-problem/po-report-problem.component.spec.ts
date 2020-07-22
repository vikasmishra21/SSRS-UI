import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReportProblemComponent } from './po-report-problem.component';

describe('PoReportProblemComponent', () => {
  let component: PoReportProblemComponent;
  let fixture: ComponentFixture<PoReportProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReportProblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReportProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
