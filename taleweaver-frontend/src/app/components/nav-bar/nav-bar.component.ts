import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleApiService } from '../../services/google/google-api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  DisplayName: string = '';
  searchTerm: string = '';
  fetchedDisplayName: boolean = false;

  @Input() dashboard: Boolean;
  constructor(
    private readonly google: GoogleApiService,
    private userService: UserService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
if (!this.fetchedDisplayName) {
      const id = this.google.getUserId(); 
      this.userService.getUserById(id).subscribe((user) => {
        this.DisplayName = user.displayName;
        this.fetchedDisplayName = true;
      });
    }
  }

  isSignedIn(){
    return this.google.isLoggedIn();
  }

  signOutWithGoogle() {
    this.google.signOut();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onInputChange(value: string) {
    // this.dataService.updateFilter(value);
  }
}
