import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { StoryService } from '../../services/story.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  cover: any = {};
  frontPages: any[] = [];
  flipped: any[] = [];
  length: number = this.frontPages.length;
  imageUrlBase = environment.apiUrl

  isFlipped: number[] = [];
  coverIsFlipped: number = 0;
  backCoverIsFlipped: number = 0;

  constructor(
    private pageService: PageService,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) { }

  flipCover() {
    if (this.flipped.length === 0) {
      this.coverIsFlipped += 1;
    }
  }

  flipBackCover() {
    if (this.frontPages.length === 0) {
      this.backCoverIsFlipped += 1;
    }

  }

  flipPage(index: number) {
    this.isFlipped[index] += 1;
    this.isFlipped[index - 1] += 1;
    this.flip(index);
  }

  flip(index: number) {
    if (this.isFlipped[index] % 2 !== 0) {
      this.flipped.push(this.frontPages[index]);
      this.flipped.push(this.frontPages[index - 1]);
      this.frontPages.splice(index - 1, 2);
    }
    else {
      this.frontPages.push(this.flipped[this.length - index]);
      this.frontPages.push(this.flipped[this.length - index - 1]);
      this.flipped.splice(-2);
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.storyService.getStoryById(id).subscribe(
        (res) => {
          this.cover = res.storyBook;
          this.dataService.updateAccess(res.access);
        },
        (error) => {
          this.router.navigate(['/dashboard']);
        }
      );
      this.pageService.getPagesByStoryBookId(id).subscribe((res) => {
        if (res.length === 0) {
          this.length = 2;
          this.frontPages.push({ page: 1, story: 'No Content For This Story Yet', image: null });
          this.frontPages.unshift({ page: 2, story: '', image: null });
          this.frontPages.forEach(() => this.isFlipped.push(0));
        }
        else {
          this.frontPages = res
            .map(item => ({
              page: item.position,
              story: item.paragraph,
              image: item.image.path
            }));
          this.length = this.frontPages.length;
          this.dataService.updateBookContent(this.frontPages.map(item => item.story).join(' '));
          this.frontPages.reverse();
          if (this.frontPages.length % 2 !== 0) {
            this.frontPages.unshift({ page: this.length + 1, story: '', image: null });
            this.length += 1;
          }
          this.frontPages.forEach(() => this.isFlipped.push(0));
        }
      });
    });
  }
}
