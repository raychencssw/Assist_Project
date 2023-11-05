import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorcheckinComponent } from './supervisorcheckin.component';

describe('SupervisorcheckinComponent', () => {
  let component: SupervisorcheckinComponent;
  let fixture: ComponentFixture<SupervisorcheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorcheckinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorcheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
