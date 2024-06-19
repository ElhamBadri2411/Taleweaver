import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.css'
})
export class ImageGeneratorComponent implements OnInit {
  form: FormGroup;
  imageUrl: string = '';

  constructor(private fb: FormBuilder, private imagesService: ImagesService) {  // Ensure service is injected
    // Initialize the form in the constructor
    this.form = this.fb.group({
      text: ['']
    });
  }

  ngOnInit(): void {
  }

  generateImage() {
    const text = this.form.get('text')?.value;
    this.imagesService.generateImage(text).subscribe((res) => {
      this.imageUrl = res.imageUrl;
    }, (error: any) => {
      console.error('Error generating image:', error);
    });
  }
}
