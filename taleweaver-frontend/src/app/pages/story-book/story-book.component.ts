import { Component } from '@angular/core';
import { BookComponent } from '../../components/book/book.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-story-book',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './story-book.component.html',
  styleUrl: './story-book.component.css'
})
export class StoryBookComponent {

}
