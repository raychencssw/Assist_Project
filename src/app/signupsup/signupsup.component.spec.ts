import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsupComponent } from './signupsup.component';

describe('SignupsupComponent', () => {
  let component: SignupsupComponent;
  let fixture: ComponentFixture<SignupsupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupsupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupsupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
