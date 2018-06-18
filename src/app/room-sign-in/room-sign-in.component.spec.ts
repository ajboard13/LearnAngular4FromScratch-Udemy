import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSignInComponent } from './room-sign-in.component';

describe('RoomSignInComponent', () => {
  let component: RoomSignInComponent;
  let fixture: ComponentFixture<RoomSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
