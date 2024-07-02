import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [RouterOutlet, NavBarComponent]
})
export class DashboardComponent {
  constructor() {
  }
}
