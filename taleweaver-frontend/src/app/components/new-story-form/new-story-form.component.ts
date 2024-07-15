import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StoryService } from '../../services/story.service';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgIconComponent } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-story-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIconComponent,
  ],
  templateUrl: './new-story-form.component.html',
  styleUrl: './new-story-form.component.css',
  viewProviders: [provideIcons({})],
})
export class NewStoryFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storyService: StoryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(250),
        ],
      ],
    });
  }

  createStory() {
    const title = this.form.get('title')?.value;
    const description = this.form.get('description')?.value;

    this.storyService.createStory(title, description).subscribe({
      next: (res) => {
        console.log(res);
        this.form.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit(): void {}
}
