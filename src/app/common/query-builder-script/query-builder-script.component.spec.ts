import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBuilderScriptComponent } from './query-builder-script.component';

describe('QueryBuilderScriptComponent', () => {
  let component: QueryBuilderScriptComponent;
  let fixture: ComponentFixture<QueryBuilderScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBuilderScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBuilderScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
