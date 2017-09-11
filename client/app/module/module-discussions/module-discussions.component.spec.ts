import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDiscussionsComponent } from './module-discussions.component';

describe('ModuleDiscussionsComponent', () => {
  let component: ModuleDiscussionsComponent;
  let fixture: ComponentFixture<ModuleDiscussionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleDiscussionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
