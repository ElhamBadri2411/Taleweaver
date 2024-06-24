import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ImagesService } from '../../services/images.service';
import { environment } from '../../../environments/environment';
import { heroSparklesSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgIconComponent],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css',
  viewProviders: [provideIcons({ heroSparklesSolid })]
})
export class ImageGeneratorComponent implements OnInit {
  form: FormGroup;
  imageUrl: string = '';
  testImageUrl: string = environment.apiUrl + "generated-images/20cbbc5619f1c04a5b32f0025461acf8.png"
  isGeneratingImage: boolean = false;

  constructor(private fb: FormBuilder, private imagesService: ImagesService) {  // Ensure service is injected
    // Initialize the form in the constructor
    this.form = this.fb.group({
      text: ['']
    });
  }

  ngOnInit(): void {
  }

  generateImage() {
    this.isGeneratingImage = true;
    const text = this.form.get('text')?.value;
    this.imagesService.generateImage(text).subscribe((res) => {
      console.log(res)
      this.imageUrl = environment.apiUrl + res.imagePath;
      this.isGeneratingImage = false
    }, (error: any) => {
      console.error('Error generating image:', error);
    });
  }
}
