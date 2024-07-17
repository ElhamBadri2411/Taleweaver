import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryBookComponent } from './story-book.component';

describe('StoryBookComponent', () => {
  let component: StoryBookComponent;
  let fixture: ComponentFixture<StoryBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
