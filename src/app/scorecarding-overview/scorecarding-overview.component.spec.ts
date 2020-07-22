import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardingOverviewComponent } from './scorecarding-overview.component';

describe('ScorecardingOverviewComponent', () => {
  let component: ScorecardingOverviewComponent;
  let fixture: ComponentFixture<ScorecardingOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardingOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
