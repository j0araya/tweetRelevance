import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleChatComponent } from './module-chat.component';

describe('ModuleChatComponent', () => {
  let component: ModuleChatComponent;
  let fixture: ComponentFixture<ModuleChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
