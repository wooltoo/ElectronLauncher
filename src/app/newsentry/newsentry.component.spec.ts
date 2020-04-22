import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsentryComponent } from './newsentry.component';

describe('NewsentryComponent', () => {
  let component: NewsentryComponent;
  let fixture: ComponentFixture<NewsentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
