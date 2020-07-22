import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsrsLoaderComponent } from './ssrs-loader.component';

describe('SsrsLoaderComponent', () => {
  let component: SsrsLoaderComponent;
  let fixture: ComponentFixture<SsrsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsrsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsrsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
