import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let component: SocketService;
  let fixture: ComponentFixture<SocketService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
