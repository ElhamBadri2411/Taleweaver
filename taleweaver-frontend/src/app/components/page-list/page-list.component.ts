import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageService } from '../../services/page.service';
import { Page } from '../../classes/Page';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-page-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIconComponent,
  ],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.css',
  viewProviders: [provideIcons({ heroPlus })],
})
export class PageListComponent implements OnInit {
  @Input() bookId: string;
  @Output() pageSelected = new EventEmitter<number>()

  pages: Page[];
  selectedPageId: number | null = null;
  imageUrlBase = environment.apiUrl

  constructor(private pageService: PageService) {
    this.pages = [];
  }

  loadPages() {
    this.pageService.getPagesByStoryBookId(+this.bookId).subscribe({
      next: (pages) => {
        this.pages = pages

        if (this.pages.length === 0) {
          this.addNewPage()
        } else {
          console.log("selected first page")
          this.selectPage(this.pages[0].id)

        }
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  reloadPages(): void {
    this.pageService.getPagesByStoryBookId(+this.bookId).subscribe({
      next: (pages) => {
        this.pages = pages

        if (this.pages.length === 0) {
          this.addNewPage()
        }
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  ngOnInit() {
    this.loadPages()
  }

  selectPage(id: number) {
    this.selectedPageId = id
    this.pageSelected.emit(id)
  }

  addNewPage() {
    this.pageService.addPage(+this.bookId).subscribe({
      next: (newPage) => {
        this.pages.push(newPage);
        this.selectPage(+newPage.id);
      },
      error: (error) => {
        console.error('Error adding new page:', error);
      }
    });
  }
}
