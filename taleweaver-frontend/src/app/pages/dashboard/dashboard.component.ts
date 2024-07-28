import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { GoogleApiService } from '../../services/google/google-api.service';
import { StoryService } from '../../services/story.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapVolumeUpFill } from '@ng-icons/bootstrap-icons';
import { bootstrapPencilSquare } from '@ng-icons/bootstrap-icons';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { bootstrapX } from '@ng-icons/bootstrap-icons';
import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';
import { DataService } from '../../services/data.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [NavBarComponent, CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      bootstrapVolumeUpFill,
      bootstrapPencilSquare,
      bootstrapX,
      bootstrapTrash,
    }),
  ],
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
export class DashboardComponent implements OnInit, OnDestroy {
  isClicked: boolean[] = [];
  storyBooks: any[] = [];
  subscription: Subscription;
  isModalOpen = false;
  bookIdToDelete: string;
  filter: string = '';
  page: number = 1;
  totalPage: number = 0;
  id = this.google.getUserId();

  constructor(
    private router: Router,
    private google: GoogleApiService,
    private storyService: StoryService,
    private dataService: DataService,
  ) {}

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

  navigateToCreateNewStory() {
    this.router.navigate(['/new-story']);
  }

  navigateToEditPage(bookId: string): void {
    this.router.navigate([`/storybook/${bookId}/edit`]);
  }

  navigateToGenerateStory() {
    this.router.navigate(['/generate-story']);
  }

  checkGeneratingStatus() {
    this.storyBooks.forEach((book) => {
      if (book.isGenerating) {
        this.storyService.getGenerationStatus(book.id).subscribe(
          (status) => {
            if (status.status === 'completed') {
              book.isGenerating = false;
            }
          },
          (error) => {
            console.error('Error fetching generation status:', error);
          },
        );
      }
    });
  }

  openModal(bookId: string) {
    this.isModalOpen = true;
    this.bookIdToDelete = bookId;
  }

  closeModal() {
    this.isModalOpen = false;
    this.bookIdToDelete = '';
  }

  confirmDelete() {
    // Call your delete logic here
    this.delete(this.bookIdToDelete);
    this.closeModal(); // Close the modal after confirming
  }

  getBooks() {
    this.dataService.filter$.subscribe((filter) => {
      this.filter = filter;
      this.storyService
        .getStoryBooks(this.id, this.page, filter)
        .subscribe((result) => {
          this.storyBooks = result.books;
          this.totalPage = result.pageOfBook;
          this.storyBooks.forEach((element) => {
            this.isClicked.push(false);
          });
        });
    });
  }

  delete(bookId: string) {
    this.storyService.deleteStory(+bookId).subscribe(() => {
      this.getBooks();
    });
  }

  ngOnInit() {
    this.getBooks();

    // Check status of generating books every 5 seconds
    this.subscription = interval(5000).subscribe(() => {
      this.checkGeneratingStatus();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
