import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDiscussionsComponent } from './preview-discussions.component';

describe('PreviewDiscussionsComponent', () => {
  let component: PreviewDiscussionsComponent;
  let fixture: ComponentFixture<PreviewDiscussionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewDiscussionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
