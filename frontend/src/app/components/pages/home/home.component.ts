import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TitleComponent } from "../../partials/title/title.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userLoged = false;
}
