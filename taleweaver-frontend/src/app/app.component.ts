import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taleweaver-frontend';
  
  constructor(private router: Router){}

  isDashboardRoute(): boolean {
    return this.router.url === '/dashboard';
  }

  isIndexRoute(): boolean {
    return this.router.url === '/';
  }
}
