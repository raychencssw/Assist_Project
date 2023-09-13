import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignuporgComponent } from './signuporg.component';

describe('SignuporgComponent', () => {
  let component: SignuporgComponent;
  let fixture: ComponentFixture<SignuporgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignuporgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignuporgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
