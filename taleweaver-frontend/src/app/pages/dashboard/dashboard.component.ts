import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [RouterOutlet, NavBarComponent, CommonModule],
    animations: [
      trigger('zoomToLeft', [
        state('initial', style({
          transform: 'scale(1)',
        })),
        state('zoom', style({
          transform: 'translate(430%, -100%) scale(2.45)',
        })),
        transition('initial => zoom', [
          animate('0.4s')
        ])
      ])
    ]
  })

export class DashboardComponent {
  isClicked: boolean = false;

  constructor(private router: Router) {
  }

  bookClicked() {
    this.isClicked = true;
  }

  onAnimationDone(event: any) {
    if (this.isClicked) {
      this.router.navigate(['/storybook']);
    }
  }
}