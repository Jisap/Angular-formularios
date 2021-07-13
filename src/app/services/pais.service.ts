import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Los rxjs operators son funciones que se pueden utilizar para crear nuevos observables (resp de apis de servers)
                                      // El map del rxjs es el que transforma lo que viene del get del http 
                                      // El segundo map es un método de cualquier array, usado en este caso para traer solo el nombre y el código del pais
@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(private http:HttpClient) { } // Para hacer peticiones http a un servidor usamos el protocolo httpClient

  getPaises(){

    return this.http.get('https://restcountries.eu/rest/v2/lang/es')
      .pipe(
        map( (resp:any[]) => {
          return resp.map(pais => 
            ({
              nombre: pais.name,
              codigo: pais.alpha3Code
            })
          )            
        })
      );
  }
}

// si eliminamos un return ponemos un ( con lo que queremos retornar en este caso un objeto {})
// quitariamos también los {} despues de =>