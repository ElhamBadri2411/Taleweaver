import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taleweaver-frontend';
  noDashboard = true;
  constructor(private router: Router) {}

  showDashboard() {
    this.router.navigate(['/dashboard']);
    this.noDashboard = false;
  }
}
