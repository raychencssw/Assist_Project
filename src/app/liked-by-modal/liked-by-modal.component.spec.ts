import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedByModalComponent } from './liked-by-modal.component';

describe('LikedByModalComponent', () => {
  let component: LikedByModalComponent;
  let fixture: ComponentFixture<LikedByModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikedByModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedByModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
