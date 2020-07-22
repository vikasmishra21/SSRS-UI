import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardingQaResponsesComponent } from './scorecarding-qa-responses.component';

describe('ScorecardingQaResponsesComponent', () => {
  let component: ScorecardingQaResponsesComponent;
  let fixture: ComponentFixture<ScorecardingQaResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardingQaResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardingQaResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
