import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupvisosignupComponent } from './supvisosignup.component';

describe('SupvisosignupComponent', () => {
  let component: SupvisosignupComponent;
  let fixture: ComponentFixture<SupvisosignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupvisosignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupvisosignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
