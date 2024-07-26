import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleApiService } from '../../services/google/google-api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapXLg } from '@ng-icons/bootstrap-icons';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  viewProviders: [provideIcons({ bootstrapXLg })]
})

export class NavBarComponent {
  displayName: string = '';
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
      if (this.google.isLoggedIn()) {
        const id = this.google.getUserId(); 
        this.userService.getUserById(id).subscribe((user) => {
          this.displayName = user.displayName;
          this.fetchedDisplayName = true;
        });
      }
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

  clearSearch() {
    this.searchTerm = '';
    this.dataService.updateFilter(this.searchTerm);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        this.dataService.updateFilter(this.searchTerm);
    }
  }
}
