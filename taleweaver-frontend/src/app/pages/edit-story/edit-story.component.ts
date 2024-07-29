import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageGeneratorComponent } from '../../components/image-generator/image-generator.component';
import { PageListComponent } from '../../components/page-list/page-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StoryService } from '../../services/story.service';

@Component({
  selector: 'app-edit-story',
  standalone: true,
  imports: [ImageGeneratorComponent, PageListComponent, CommonModule],
  templateUrl: './edit-story.component.html',
  styleUrl: './edit-story.component.css',
})
export class EditStoryComponent implements OnInit {
  bookId: string;
  bookTitle: string;
  bookDesc: string;
  selectedPageId: number | null = null;
  pagesLen: number;

  @ViewChild(PageListComponent) pageListComponent: PageListComponent;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
  ) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('bookId') || '';
    this.getPagesLen();
  }

  onPageSelected(pageId: number) {
    this.selectedPageId = pageId;
    this.getPagesLen();
  }

  getPagesLen() {
    this.pagesLen = this.pageListComponent.pages.length;
  }

  onImageGenerated() {
    if (this.pageListComponent) {
      this.pageListComponent.reloadPages();
      this.getPagesLen();
    }
  }

  onPageDeleted() {
    if (this.pageListComponent) {
      this.pageListComponent.loadPages();
      this.getPagesLen();
    }
  }
}
