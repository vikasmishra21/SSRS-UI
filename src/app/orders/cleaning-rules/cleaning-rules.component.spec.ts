import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningRulesComponent } from './cleaning-rules.component';

describe('CleaningRulesComponent', () => {
  let component: CleaningRulesComponent;
  let fixture: ComponentFixture<CleaningRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
