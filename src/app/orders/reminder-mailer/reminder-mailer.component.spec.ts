import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderMailerComponent } from './reminder-mailer.component';

describe('ReminderMailerComponent', () => {
  let component: ReminderMailerComponent;
  let fixture: ComponentFixture<ReminderMailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderMailerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
