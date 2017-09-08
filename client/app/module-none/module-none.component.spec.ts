import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleNoneComponent } from './module-none.component';

describe('ModuleNoneComponent', () => {
  let component: ModuleNoneComponent;
  let fixture: ComponentFixture<ModuleNoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleNoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleNoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
