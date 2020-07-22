import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordMatchingComponent } from './record-matching.component';

describe('RecordMatchingComponent', () => {
  let component: RecordMatchingComponent;
  let fixture: ComponentFixture<RecordMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
