import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStoryFormComponent } from './new-story-form.component';

describe('NewStoryFormComponent', () => {
  let component: NewStoryFormComponent;
  let fixture: ComponentFixture<NewStoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStoryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewStoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
