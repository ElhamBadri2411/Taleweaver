import { Routes } from '@angular/router';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { GoogleSigninComponent } from './components/google-signin/google-signin.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'image-generator', component: ImageGeneratorComponent },
  {path: 'signin', component: GoogleSigninComponent},
  { path: 'new-story', component: NewStoryFormComponent },
{ path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '', pathMatch: 'full' }
];
