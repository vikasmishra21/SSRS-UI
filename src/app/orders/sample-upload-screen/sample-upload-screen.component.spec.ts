import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleUploadScreenComponent } from './sample-upload-screen.component';

describe('SampleUploadScreenComponent', () => {
  let component: SampleUploadScreenComponent;
  let fixture: ComponentFixture<SampleUploadScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleUploadScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleUploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
