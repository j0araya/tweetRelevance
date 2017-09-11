import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewNoneComponent } from './preview-none.component';

describe('PreviewNoneComponent', () => {
  let component: PreviewNoneComponent;
  let fixture: ComponentFixture<PreviewNoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewNoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewNoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
