import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleApiService } from '../../services/google/google-api.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  DisplayName: string = '';
  constructor(
    private readonly google: GoogleApiService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const id = this.google.getUserId();
    this.userService.getUserById(id).subscribe((user) => {
      this.DisplayName = user.displayName;
    });
  }

  isSignedIn(){
    return this.google.isLoggedIn();
  }

  signOutWithGoogle() {
    this.google.signOut();
  }
}
