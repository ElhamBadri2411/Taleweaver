import { Routes } from '@angular/router';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';

export const routes: Routes = [
  { path: 'image-generator', component: ImageGeneratorComponent },
  { path: '', redirectTo: 'image-generator', pathMatch: 'full' }
];
