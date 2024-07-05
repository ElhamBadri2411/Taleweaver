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
  pages: any[] = [
    { page: 1, story: 'This is the first page' },
    { page: 2, story: 'This is the second page' },
    { page: 3, story: 'This is the third page' },
    { page: 4, story: 'This is the fourth page' },
  ];

  flippedPages: any[] = [];

  isFlipped: number[] = [];
  coverIsFlipped: number = 0;
  backCoverIsFlipped: number = 0;

  constructor() {
    //should be handled by the backend later
    this.pages.reverse();

    this.pages.forEach(() => this.isFlipped.push(0));
  }

  flipCover() {
    this.coverIsFlipped += 1;
  }

  flipBackCover() {
    this.backCoverIsFlipped += 1;
  }

  flipPage(index: number) {
    this.isFlipped[index] += 1;

    if (this.isFlipped[index] % 2 === 0) {
        this.movePages(this.flippedPages, this.pages);
    } else {
        this.movePages(this.pages, this.flippedPages);
    }

    console.log(this.pages);
    console.log(this.flippedPages);
    console.log(this.isFlipped);
  }

  movePages(fromArray: any[], toArray: any[]) {
      const moveLength = 2;

      if (fromArray.length >= moveLength) {
          for (let i = 0; i < moveLength; i++) {
              toArray.unshift(fromArray[fromArray.length - moveLength + i]);
          }
          fromArray.splice(fromArray.length - moveLength, moveLength);
      } else if (fromArray.length === 1) {
          toArray.unshift(fromArray.pop());
      }
  }
}
