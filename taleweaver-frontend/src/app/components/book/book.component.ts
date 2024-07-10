import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { StoryService } from '../../services/story.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../classes/Page';

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
  fliped: any[] = [];
  length: number = this.frontPages.length;

  isFlipped: number[] = [];
  coverIsFlipped: number = 0;
  backCoverIsFlipped: number = 0;

  constructor( 
    private pageService: PageService,
    private storyService: StoryService,
    private route: ActivatedRoute, 
  ){ }

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

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.storyService.getStoryById(id).subscribe((story) => {
        this.cover = story;
      });
      this.pageService.getPageById(id).subscribe((res) => {
          if (Object.keys(res).length === 0){
            this.length = 2;
            this.frontPages.push({ page: 1, story: 'No Content For This Story Yet' });
            this.frontPages.unshift({ page: 2, story: '' });
            this.frontPages.forEach(() => this.isFlipped.push(0));
          }
          else{
            console.log(res);
          }
          // this.frontPages = [res];
          // this.length = this.frontPages.length;
          // this.frontPages.reverse();
          // if (this.frontPages.length % 2 !== 0) {
          //   this.frontPages.unshift({ page: this.length + 1, story: 'This is the last page' });
          //   this.length += 1;
          // }
          // this.frontPages.forEach(() => this.isFlipped.push(0));
      });
    });
  }
}
