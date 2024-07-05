import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { GoogleApiService } from './services/google/google-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taleweaver-frontend';

  constructor(
    private readonly google: GoogleApiService,
    private router: Router,
  ) {}

  signInWithGoogle() {
    this.google.signIn();
  }

  signOutWithGoogle() {
    this.google.signOut();
  }

  isSignedIn() {
    return this.google.isLoggedIn();
  }
}
