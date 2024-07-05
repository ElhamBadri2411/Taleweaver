import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleApiService } from '../../services/google/google-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  constructor(
    private readonly google: GoogleApiService,
    private router: Router
  ) {}

  isSignedIn(){
    return this.google.isLoggedIn();
  }

  signOutWithGoogle() {
    this.google.signOut();
  }
}
