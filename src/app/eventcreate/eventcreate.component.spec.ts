import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcreateComponent } from './eventcreate.component';

describe('EventcreateComponent', () => {
  let component: EventcreateComponent;
  let fixture: ComponentFixture<EventcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventcreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
