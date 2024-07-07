import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  frontPages: any[] = [
    { page: 1, story: 'This is the first page' },
    { page: 2, story: 'This is the second page' },
    { page: 3, story: 'This is the third page' },
    { page: 4, story: 'This is the fourth page' },
    { page: 5, story: 'This is the fivth page' },
    { page: 6, story: 'This is the sixth page' },
    { page: 7, story: 'This is the seventh page' },
    { page: 8, story: 'This is the eighth page' },
    { page: 9, story: 'This is the ninth page' },
    { page: 10, story: 'This is the tenth page' },
    { page: 11, story: 'This is the eleventh page' },
  ];
  fliped: any[] = [];
  length: number = this.frontPages.length;

  isFlipped: number[] = [];
  coverIsFlipped: number = 0;
  backCoverIsFlipped: number = 0;

  constructor() {
    this.frontPages.reverse();
    if (this.frontPages.length % 2 !== 0) {
      this.frontPages.unshift({ page: this.length + 1, story: 'This is the last page' });
      this.length += 1;
    }
    this.frontPages.forEach(() => this.isFlipped.push(0));
  }

  flipCover() {
    this.coverIsFlipped += 1;
  }

  flipBackCover() {
    this.backCoverIsFlipped += 1;
  }

  flipPage(index: number) {
    this.isFlipped[index] += 1;
    this.isFlipped[index-1] += 1;
    this.flip(index);
  }

  flip(index: number){
    if (this.isFlipped[index] % 2 !== 0) {
      this.fliped.push(this.frontPages[index]);
      this.fliped.push(this.frontPages[index-1]);
      this.frontPages.splice(index-1, 2);
    }
    else{
      this.frontPages.push(this.fliped[this.length - index]);
      this.frontPages.push(this.fliped[this.length - index-1]);
      this.fliped.splice(-2);
    }
  }
}
