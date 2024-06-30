import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { GoogleApiService } from './services/google/google-api.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
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
