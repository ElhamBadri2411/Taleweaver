import { Component } from '@angular/core';
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
export class PageListComponent {
  pages: Page[]

  constructor(private pageService: PageService) {
    this.pages = [{
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }, {
      id: 0,
      paragraph: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      image:
        environment.apiUrl +
        'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png',
      order: 0
    }
    ]
  }
}
