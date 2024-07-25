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

  @ViewChild(PageListComponent) pageListComponent: PageListComponent;

  constructor(private route: ActivatedRoute,
    private storyService: StoryService
  ) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('bookId') || '';
    this.storyService.getStoryById(+this.bookId).subscribe({
      next: (res) => {
        this.bookTitle = res.title
        this.bookDesc = res.description
      },
      error: (err) => {
        console.log(err)
      }
    })

  }

  onPageSelected(pageId: number) {
    this.selectedPageId = pageId;
  }

  onImageGenerated() {
    if (this.pageListComponent) {
      console.log("onIMAGEGENERATED!")
      this.pageListComponent.reloadPages();
    }
  }

  onPageDeleted() {
    if (this.pageListComponent) {
      console.log("on page deleted")
      this.pageListComponent.loadPages();
    }
  }
}
