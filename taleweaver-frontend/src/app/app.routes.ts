import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditStoryComponent } from './pages/edit-story/edit-story.component';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: 'image-generator',
    component: ImageGeneratorComponent,
    canActivate: [AuthService],
  },
  {
    path: 'new-story',
    component: NewStoryFormComponent,
    canActivate: [AuthService],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  { path: 'books/:bookId/edit', component: EditStoryComponent },
];
