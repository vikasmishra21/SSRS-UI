import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialMailerComponent } from './initial-mailer.component';

describe('InitialMailerComponent', () => {
  let component: InitialMailerComponent;
  let fixture: ComponentFixture<InitialMailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialMailerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
