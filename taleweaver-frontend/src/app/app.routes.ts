import { Routes } from '@angular/router';
import { GoogleSigninComponent } from './components/google-signin/google-signin.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditStoryComponent } from './pages/edit-story/edit-story.component';

export const routes: Routes = [
  { path: 'signin', component: GoogleSigninComponent },
  { path: 'new-story', component: NewStoryFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books/:bookId/edit', component: EditStoryComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
