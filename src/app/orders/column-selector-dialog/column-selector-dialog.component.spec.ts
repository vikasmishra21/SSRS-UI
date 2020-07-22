import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';

describe('ColumnSelectorDialogComponent', () => {
  let component: ColumnSelectorDialogComponent;
  let fixture: ComponentFixture<ColumnSelectorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnSelectorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
