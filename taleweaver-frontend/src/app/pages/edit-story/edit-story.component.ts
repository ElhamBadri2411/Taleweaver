import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageGeneratorComponent } from '../../components/image-generator/image-generator.component';
import { PageListComponent } from '../../components/page-list/page-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-story',
  standalone: true,
  imports: [ImageGeneratorComponent, PageListComponent, CommonModule],
  templateUrl: './edit-story.component.html',
  styleUrl: './edit-story.component.css',
})
export class EditStoryComponent implements OnInit {
  bookId: string;
  selectedPageId: number | null = null;

  @ViewChild(PageListComponent) pageListComponent: PageListComponent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('bookId') || '';
  }

  onPageSelected(pageId: number) {
    this.selectedPageId = pageId;
  }

  onImageGenerated() {
    console.log("onImageGenerated callsed")
    if (this.pageListComponent) {
      this.pageListComponent.loadPages();
    }

  }
}
