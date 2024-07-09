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
        })),
        state('zoom', style({
          transform: 'translate(430%, -100%) scale(2.45)',
        })),
        transition('initial => zoom', [
          animate('0.4s')
        ])
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
    return new Date(date).toLocaleDateString();
  }

  onAnimationDone(event: any) {
    if (this.isClicked.includes(true)){
      this.router.navigate(['/storybook']);
    }
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