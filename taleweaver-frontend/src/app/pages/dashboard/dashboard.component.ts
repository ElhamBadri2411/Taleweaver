import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { GoogleApiService } from '../../services/google/google-api.service';
import { StoryService } from '../../services/story.service';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [NavBarComponent, CommonModule],
  animations: [
    trigger('zoomToLeft', [
      state('initial', style({
        transform: 'scale(1)',
        opacity: 1,
        zIndex: 0,
      })),
      state('zoom', style({
        transform: 'translateY(-50%) translateX(-50%) scale(2)',
        opacity: 0,
        zIndex: 1000,
      })),
      transition('initial => zoom', [
        animate('0.8s cubic-bezier(0.25, 0.5, 0.25, 1)')
      ]),
    ])
  ]
})

export class DashboardComponent {
  isClicked: boolean[] = [];
  storyBooks: any[] = [];

  constructor(
    private router: Router,
    private google: GoogleApiService,
    private storyService: StoryService
  ) { }

  bookClicked(index: number) {
    this.isClicked[index] = true;
    console.log(this.isClicked);
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

  navigateToCreateNewStory() {
    this.router.navigate(['/new-story'])
  }

  navigateToEditPage(bookId: string): void {
    this.router.navigate([`/books/${bookId}/edit`])

  }

  ngOnInit() {
    const id = this.google.getUserId();
    this.storyService.getStoryBooks(id).subscribe((books) => {
      this.storyBooks = books;
      this.storyBooks.forEach(element => {
        this.isClicked.push(false);
      });
    });
  }
}
