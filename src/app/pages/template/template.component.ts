import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  usuario = {
    nombre: '',
    apellido:'',
    correo:'',
    pais: '',
    genero:''
  }

  paises: any[] = [];

  constructor(private paisService: PaisService) { } // Insertamos el service paisService en el componente

  ngOnInit(): void {

    this.paisService.getPaises()                    // Al iniciar el componente lo usamos y hacemos una petición a la API
      .subscribe(paises => {
        this.paises = paises;                       // Guardamos la respuesta en un array
        
        this.paises.unshift({                       // Valores del select al iniciar la página 
          nombre: '[Seleccione País]',
          codigo: ''
        })
        
        //console.log(this.paises);
      })
  }

  guardar(forma:NgForm){

  if(forma.invalid){                                   // Si los valores del formulario son invalidos...

    Object.values(forma.controls).forEach(control =>{  // Identificamos los valores del formulario y los marcamos como Touched
      control.markAsTouched();                         // Con esto se cumplen las dos condiciones para poner la clase del html class.is-invalid 
    })
    return;
  }

    console.log(forma);
    console.log(forma.value);
  }
}
