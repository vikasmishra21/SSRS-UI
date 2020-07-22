import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDataExtractComponent } from './final-data-extract.component';

describe('FinalDataExtractComponent', () => {
  let component: FinalDataExtractComponent;
  let fixture: ComponentFixture<FinalDataExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalDataExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalDataExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
