import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'image-generator', component: ImageGeneratorComponent },
  { path: 'new-story', component: NewStoryFormComponent },
  { path: 'dashboard', component: DashboardComponent },
];
