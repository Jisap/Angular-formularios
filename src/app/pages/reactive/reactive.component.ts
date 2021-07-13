import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})

export class ReactiveComponent implements OnInit {

  forma: FormGroup;                                          // Inicializamos nuestro formulario reactivo

  constructor(private fb: FormBuilder,                       // FormBuilder es un servicio que nos ayuda a crear formularios
              private validadores: ValidadoresService  ) {   // validadores es un servicio de validaciones personalizadas

    this.crearFormulario();                                  // Creamos el formulario antes de iniciar el componente
    this.cargarDataAlFormulario();
    this.crearListeners(); 
  }

  ngOnInit(): void {
  }

  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched; // Si el campo 'nombre' es invalido y ha sido tocado
  }                                                                              // get nombreNoValido() devolverá true

  get apellidoNoValido() {
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched; 
  }  

  get correoNoValido() {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched; 
  }  

  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched;
  }

  get distritoNoValido() {
    return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched;
  }

  get ciudadNoValido() {
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched;
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray; // Rescata del formulario los valores de pasatiempos como un array
  }

  pasatiempoNoValido(i:number):boolean{
    return this.pasatiempos.at(i).invalid && (this.pasatiempos.at(i).touched || this.pasatiempos.at(i).dirty);
  }

  get pass1NoValido() {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched; // 
  }

  get pass2NoValido() {
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    return (pass1 === pass2) ? false : true ; // Si pass1=pass2 -> false sino true 
  }

  crearFormulario(){

    this.forma = this.fb.group({        // Para crear el formulario usamos el servicio FormBuilder(fb) sobre la instancia FormGroup(forma)

      // MODELO DEL FORMULARIO (CONTROLS)

      nombre: ['', [Validators.required, Validators.minLength(5)]],      // Segundo arg son los validadores síncronos -> No necesitan servicios externos y se ejecutan en el mismo hilo de tiempo
      apellido: ['', [Validators.required, this.validadores.noHerrera]], // apellido cuenta con un validador personalizado   
      correo: ['', [Validators.required, Validators.pattern('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')]],
      usuario: ['', , this.validadores.existeUsuario], // Validador asíncrono (3 argumento)
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
      direccion:this.fb.group({ // Formulario anidado
        distrito:['', Validators.required],   
        ciudad: ['', Validators.required]
      }),
      pasatiempos: this.fb.array([])  // pasatiempos es un array vacio
    },{
      validators: this.validadores.passwordsIguales('pass1','pass2') // validators son validadores síncronos en este caso provistos por un servicio
    });
  }

  crearListeners(){

    // this.forma.valueChanges.subscribe(valor => {  // Observa los cambios en los valores del formulario
    //   console.log(valor);
    // });

    // this.forma.statusChanges.subscribe( status => { // Observa los cambios en el estado de las validaciones de cada campo
    //   console.log(status);
    // })

    this.forma.get('nombre').valueChanges.subscribe(console.log); // si queremos observar un solo campo
  }


  cargarDataAlFormulario(){

    //this.forma.setValue({
    this.forma.reset({  
      nombre: 'Juan Pedro',
      apellido: 'Herrera',
      correo: 'juan@gmail.com',
      usuario: '',
      pass1: '123',
      pass2: '123',
      direccion: {
        distrito: 'Federal',
        ciudad: 'Mexico'
      },
      pasatiempos: []                // Al cargar el formulario lo definiremos como vacio 
    })
  }

  agregarPasatiempo(){
    this.pasatiempos.push(this.fb.control('Nuevo elemento', Validators.required));  // Rescata del formulario los valores de pasatiempos como un array
  }                                                                                 // y le agregamos un control al modelo por cada campo agregado.

  borrarPasatiempo(i:number){
    this.pasatiempos.removeAt(i);
  }

  guardar(){

    console.log(this.forma);

    if (this.forma.invalid) {                                          // Si los valores del formulario son invalidos...

      return Object.values(this.forma.controls).forEach(control => {   // Identificamos los valores del formulario y los marcamos como Touched
                                                                       // Con esto se cumplen las dos condiciones para poner la clase del html class.is-invalid
        if(control instanceof FormGroup){
          
          Object.values(control.controls).forEach(control => control.markAsTouched());// Establecemos esta identificación para los formularios
                                                                                      // anidados. 
        }else{
          
          control.markAsTouched();                                       
        
        }
        
      });
      
    }else{
      // Posteo de información --> reset de campos
  
      this.forma.reset();

    }
  }
}
