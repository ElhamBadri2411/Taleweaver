import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { GoogleApiService } from '../../services/google/google-api.service';
import { StoryService } from '../../services/story.service';

import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
  animations: [
    trigger('zoomToLeft', [
      state(
        'initial',
        style({
          transform: 'scale(1)',
          opacity: 1,
          zIndex: 0,
        }),
      ),
      state(
        'zoom',
        style({
          transform: 'translateY(-50%) translateX(-50%) scale(2)',
          opacity: 0,
          zIndex: 1000,
        }),
      ),
      transition('initial => zoom', [
        animate('0.8s cubic-bezier(0.25, 0.5, 0.25, 1)'),
      ]),
    ]),
  ],
})
export class LibraryComponent {
  constructor(
    private router: Router,
    private storyService: StoryService,
    private dataService: DataService,
  ) {}

  isClicked: boolean[] = [];
  storyBooks: any[] = [];
  filter: string = '';
  page: number = 1;
  totalPage: number = 0;

  bookClicked(index: number) {
    this.isClicked[index] = true;
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  onAnimationDone(event: any) {
    if (this.isClicked.includes(true)) {
      const index = this.isClicked.indexOf(true);
      const id = this.storyBooks[index].id;
      this.router.navigate(['/storybook', id]);
    }
  }

  getBooks() {
    this.dataService.filter$.subscribe((filter) => {
      this.filter = filter;
      this.storyService
        .getPublicStoryBooks(this.page, filter)
        .subscribe((result) => {
          this.storyBooks = result.books;
          this.totalPage = result.pageOfBook;
          this.storyBooks.forEach((element) => {
            this.isClicked.push(false);
          });
        });
    });
  }

  ngOnInit() {
    this.getBooks();
  }

  next() {
    if (this.page < this.totalPage) {
      this.page++;
      this.getBooks();
    }
  }

  previous() {
    if (this.page > 1) {
      this.page--;
      this.getBooks();
    }
  }
}
