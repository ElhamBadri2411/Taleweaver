import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGenerationFormComponent } from './book-generation-form.component';

describe('BookGenerationFormComponent', () => {
  let component: BookGenerationFormComponent;
  let fixture: ComponentFixture<BookGenerationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGenerationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookGenerationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
