import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFilterQueryBuilderComponent } from './sql-filter-query-builder.component';

describe('SqlFilterQueryBuilderComponent', () => {
  let component: SqlFilterQueryBuilderComponent;
  let fixture: ComponentFixture<SqlFilterQueryBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlFilterQueryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlFilterQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
