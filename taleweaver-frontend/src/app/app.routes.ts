import { Routes } from '@angular/router';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'image-generator', component: ImageGeneratorComponent },
  { path: 'new-story', component: NewStoryFormComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent }
];
