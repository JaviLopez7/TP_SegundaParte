import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-no-encontrado',
  templateUrl: './no-encontrado.component.html',
  styleUrls: ['./no-encontrado.component.css']
})
export class NoEncontradoComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    document.body.classList.add('fondo-no-encontrado');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('fondo-no-encontrado');
  }
}


