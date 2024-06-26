import { Component } from '@angular/core';
import { GoogleApiService } from '../../services/google/google-api.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { bootstrapGoogle } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.css',
  viewProviders: [provideIcons({ bootstrapGoogle })]
})
export class GoogleSigninComponent {

  constructor(private readonly google: GoogleApiService) { }

  signInWithGoogle() {
    this.google.signIn();
  }

  signOutWithGoogle() {
    this.google.signOut();
  }

  isSignedIn(){
    return this.google.isLoggedIn();
  }

}
