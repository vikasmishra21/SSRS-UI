import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosstabDefinitionComponent } from './crosstab-definition.component';

describe('CrosstabDefinitionComponent', () => {
  let component: CrosstabDefinitionComponent;
  let fixture: ComponentFixture<CrosstabDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosstabDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosstabDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
