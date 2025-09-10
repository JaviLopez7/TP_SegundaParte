import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Importá RouterModule

@Component({
  standalone: true,
  selector: 'app-gestion',
  imports: [RouterModule],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent {
  // Podés dejar esto vacío o agregar lógica si necesitás
}

