import { Component } from '@angular/core';
import { BookComponent } from '../../components/book/book.component';
import { ToolBarComponent } from '../../components/tool-bar/tool-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story-book',
  standalone: true,
  imports: [BookComponent, ToolBarComponent, CommonModule],
  templateUrl: './story-book.component.html',
  styleUrl: './story-book.component.css',
})
export class StoryBookComponent {
  loading: boolean = false;
  constructor() {}

  onStateChange(state: string) {
    if (state === 'loading') {
      this.loading = true;
    } else if (state === 'done') {
      this.loading = false;
    }
  }
}
