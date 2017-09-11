import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleHelpCenterComponent } from './module-help-center.component';

describe('ModuleHelpCenterComponent', () => {
  let component: ModuleHelpCenterComponent;
  let fixture: ComponentFixture<ModuleHelpCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleHelpCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleHelpCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
