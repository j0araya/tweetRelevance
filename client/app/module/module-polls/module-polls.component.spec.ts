import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePollsComponent } from './module-polls.component';

describe('ModulePollsComponent', () => {
  let component: ModulePollsComponent;
  let fixture: ComponentFixture<ModulePollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulePollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
