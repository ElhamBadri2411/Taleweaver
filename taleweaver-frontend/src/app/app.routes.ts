import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { NewStoryFormComponent } from './components/new-story-form/new-story-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditStoryComponent } from './pages/edit-story/edit-story.component';
import { AuthService } from './services/auth.service';
import { StoryBookComponent } from './pages/story-book/story-book.component';
import { LibraryComponent } from './pages/library/library.component';
import { BookGenerationFormComponent } from './components/book-generation-form/book-generation-form.component';
import { CreditComponent } from './pages/credit/credit.component';

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
    path: 'generate-story',
    component: BookGenerationFormComponent,
    canActivate: [AuthService],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  {
    path: 'storybook/:bookId/edit',
    component: EditStoryComponent,
    canActivate: [AuthService],
  },

  {
    path: 'storybook/:id',
    component: StoryBookComponent,
    canActivate: [AuthService],
  },

  {
    path: 'credit',
    component: CreditComponent,
    canActivate: [AuthService],
  },

  {
    path: 'library',
    component: LibraryComponent,
    canActivate: [AuthService],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
