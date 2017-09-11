import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleNotesComponent } from './module-notes.component';

describe('ModuleNotesComponent', () => {
  let component: ModuleNotesComponent;
  let fixture: ComponentFixture<ModuleNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
