import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';
import { CreditComponent } from "./pages/credit/credit.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, CommonModule, CreditComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taleweaver-frontend';
  
  constructor(private router: Router){}

  ableToSearch(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/library';
  }

  isIndexRoute(): boolean {
    return this.router.url === '/';
  }

  isCreditRoute(): boolean {
    return this.router.url === '/credit';
  }

  toCredit() {
    this.router.navigateByUrl('/credit');
  }
}
