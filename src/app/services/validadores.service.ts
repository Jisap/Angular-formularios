import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate{
  [s:string]: boolean        // Esta interface define que lo que se reciba en [] devolverá un  booleano.
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }
  
  existeUsuario(control: FormControl):Promise<ErrorValidate> | Observable<ErrorValidate>{

    if ( !control.value){            // Si no se ha escrito nada en el campo usuario
      return Promise.resolve(null);  // Resolvemos la promesa como null para que no dispare la validación automáticamente.
    }

    return new Promise( ( resolve, reject) => {  // Esta validación devuelve una promesa de respuesta

      setTimeout(()=>{                     // Simulamos retardo en la respuesta 

        if(control.value ==='strider'){
          resolve({existe:true});          // Validación no pasa porque el usuario ya existe
        }else{
          resolve(null);                   // Validación pasa
        }

      }, 3500);
    });
  }
                                                        // Lo que se reciba en [] servirá para devolver un booleano -> se podría usar la interfaz ErrorValidate
  noHerrera(control:FormControl):{[s:string]:boolean}{  // Validación personalizada consistente en no permitir poner Herrera
  
    if(control.value?.toLowerCase() === 'herrera'){ // Si el valor del campo existe lo pasa a minúsculas  y luego lo compara con 'herrera'
      return {                                      // si existe coincidencia la función devolverá true.
        noHerrera: true              
      }
    }

    return null; // Si pone cualquier otra cosa en el campo la función devolverá null
  }
  
  //Valido con Angular 10
  passwordsIguales(pass1Name:string, pass2Name: string){  // Validación personalizada para comprobar que dos pass son iguales

    return (formGroup: FormGroup) => {                    // Devolverá un función que es la que ejecutará en los validators
                                                          // Esta función recibirá como argumento un formulario
      
      const pass1Control = formGroup.controls[pass1Name]; // Valor del campo del pass1
      const pass2Control = formGroup.controls[pass2Name]; // Valor del campo del pass2 

      if (pass1Control.value === pass2Control.value){  // Si los valores de pass1 = pass2
        pass2Control.setErrors(null);                  // pass2Control no contendrá errores               
      }else{                                           // Si son distintos 
        pass2Control.setErrors({noEsIgual: true})      // pass2Control tendrá errores -> noEsIgual = true
      }

    }

  }

}

//Valido con Angular 11

// camposIguales(campo1 : string, campo2: string) {                        // Esta función devolverá como argumento un control abstracto (control)
                                                                           // estos proporcionan algunos de los comportamientos compartidos que tienen 
//                                                                         // todos los controles
//  return (control: AbstractControl): ValidationErrors | null => {

//     const pass1 = control.get(campo1)?.value;      // pass1
//     const pass2 = control.get(campo2)?.value;      // pass2

//     console.log(pass1, pass2);

//     if (pass1 !== pass2) {                                  // Si las pass no son iguales
//       control.get(campo2)?.setErrors({ noIguales: true });  // el control de pass2 establecerá que el error: noIguales=true --> Si errors --> No Pasará la validacion
//       return { noIguales: true };
//     }

//     return null;                                            // Si las pass si son iguales la función devolverá null --> No errors --> Si pasará la validación
//   }
// }