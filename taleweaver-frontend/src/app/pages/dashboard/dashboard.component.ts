
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { GoogleApiService } from '../../services/google/google-api.service';
import { StoryService } from '../../services/story.service';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { interval, Subscription } from 'rxjs';

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
export class DashboardComponent implements OnInit, OnDestroy {
  isClicked: boolean[] = [];
  storyBooks: any[] = [];
  subscription: Subscription;

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
    this.router.navigate(['/new-story']);
  }

  navigateToEditPage(bookId: string): void {
    this.router.navigate([`/books/${bookId}/edit`]);
  }

  navigateToGenerateStory() {
    this.router.navigate(['/generate-story']);
  }

  checkGeneratingStatus() {
    this.storyBooks.forEach(book => {
      if (book.isGenerating) {
        this.storyService.getGenerationStatus(book.id).subscribe(
          status => {
            if (status.status === 'completed') {
              book.isGenerating = false;
            }
          },
          error => {
            console.error('Error fetching generation status:', error);
          }
        );
      }
    });
  }

  ngOnInit() {
    const id = this.google.getUserId();
    this.storyService.getStoryBooks(id).subscribe((books) => {
      this.storyBooks = books;
      this.storyBooks.forEach(element => {
        this.isClicked.push(false);
      });

      // Check status of generating books every 5 seconds
      this.subscription = interval(5000).subscribe(() => {
        this.checkGeneratingStatus();
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

