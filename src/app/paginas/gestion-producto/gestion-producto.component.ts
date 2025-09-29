import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-gestion-producto',
  imports: [RouterModule, RouterLink],
  templateUrl: './gestion-producto.component.html',
  styleUrl: './gestion-producto.component.css'
})
export class GestionProductoComponent {

}
