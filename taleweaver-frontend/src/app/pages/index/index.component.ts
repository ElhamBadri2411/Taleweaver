import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from '../../services/google/google-api.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  viewProviders: [provideIcons({ bootstrapGoogle })]
})

export class IndexComponent {
  constructor(
    private readonly google: GoogleApiService, 
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isSignedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  signInWithGoogle() {
    this.google.signIn();
  }

  isSignedIn(){
    return this.google.isLoggedIn();
  }
}
