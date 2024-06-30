import { Component } from '@angular/core';
import { ImageGeneratorComponent } from '../../components/image-generator/image-generator.component';
import { PageListComponent } from '../../components/page-list/page-list.component';

@Component({
  selector: 'app-edit-story',
  standalone: true,
  imports: [ImageGeneratorComponent, PageListComponent],
  templateUrl: './edit-story.component.html',
  styleUrl: './edit-story.component.css',
})
export class EditStoryComponent {}
