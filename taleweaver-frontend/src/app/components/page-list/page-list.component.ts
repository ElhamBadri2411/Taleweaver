import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageService } from '../../services/page.service';
import { Page } from '../../classes/Page';
import { environment } from '../../../environments/environment';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';

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

  constructor(private pageService: PageService) {
    this.pages = [
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/d5040800b70f442631e26b4e8cfaa259.png',
        order: 0,
      },
      {
        id: 1,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 1,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
      {
        id: 0,
        paragraph:
          'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
        image:
          environment.apiUrl +
          'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
        order: 0,
      },
    ];
  }

  loadPages() {
    this.pageService.getPagesByStoryBookId(+this.bookId).subscribe({
      next: (pages) => {
        console.log(pages, "PAGES HERE")
        this.pages = pages
      },
      error: (error) => {
        console.log("ERROPR")
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
