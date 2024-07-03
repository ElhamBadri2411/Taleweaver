import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ImagesService } from '../../services/images.service';
import { environment } from '../../../environments/environment';
import { heroSparklesSolid } from '@ng-icons/heroicons/solid';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIconComponent,
  ],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css',
  viewProviders: [provideIcons({ heroSparklesSolid })],
})
export class ImageGeneratorComponent implements OnInit, OnChanges {
  @Input() bookId: string;
  @Input() pageId: number | null;
  @Output() imageGenerated = new EventEmitter<void>()


  title: string = 'Test title'
  form: FormGroup;
  imageUrl: string = '';
  testImageUrl: string =
    environment.apiUrl +
    'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png';
  isGeneratingImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private pagesService: PageService
  ) {
    this.form = this.fb.group({
      text: [''],
    });
  }

  ngOnInit(): void {
    this.loadPageData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadPageData()
  }


  loadPageData(): void {
    this.imageUrl = ''
    if (this.pageId !== null) {
      this.pagesService.getPageById(this.pageId).subscribe({
        next: (res) => {
          this.form.patchValue({ text: res.paragraph })
          if (res.image.path) {
            this.imageUrl = environment.apiUrl + res.image.path
          }
        },
        error: (error) => {
          console.error(error)

        }
      })

    }
  }


  generateImage() {
    this.isGeneratingImage = true;
    const text = this.form.get('text')?.value;
    this.imagesService.generateImage(text, this.pageId || 1).subscribe(
      (res) => {
        console.log(res);
        this.imageUrl = environment.apiUrl + res.imagePath;
        this.isGeneratingImage = false;
        this.imageGenerated.emit()
      },
      (error: any) => {
        console.error('Error generating image:', error);
      },
    );
  }
}
