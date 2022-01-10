import { Component, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { Movimiento } from 'src/app/interfaces/movimiento.interface';
import { MovimientosService } from 'src/app/services/movimientos.service';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})

export class MovimientosComponent implements OnInit {
  // Initialization of global variables
  movimientosList: Movimiento[] = [];
  categoriasList: Categoria[] = [];
  movimientosListId: Movimiento[] = [];
  displayedColumns: string[] = ['fecha', 'nombre', 'precio', 'categorias', 'actions'];
  balanceMes = 0;
  ultimoId = 0;
  constructor(private categoriaSvc: CategoriasService, private movimientoSvc: MovimientosService, private router: Router) { }

  ngOnInit(): void {
    this.getMovimientos();
    this.getCategorias();
  }

  // Get all the movements
  getMovimientos(){
    this.movimientoSvc.getMovimientos()
    .subscribe((movimientos) => {
      this.movimientosList = movimientos;
      this.movimientosList.sort(function(a, b) {
        return a.fecha>b.fecha ? -1 : a<b ? 1 : 0;
    });
   });
  }

  // Get all the categories
  getCategorias(){
    this.categoriaSvc.getCategorias()
    .subscribe((categorias) => {
      this.categoriasList = categorias;
   });
  }

  // Get las category ID of the data
  getUltimoId(){
    this.movimientoSvc.getMovimientos()
    .subscribe((movimientos) => {
      this.movimientosListId = movimientos;
      this.movimientosListId.sort(function(a, b) {
        return a.id<b.id ? -1 : a>b ? 1 : 0;
      });
      this.ultimoId = this.movimientosListId[this.movimientosListId.length-1].id;
    });
  }

  // Get the monthly balance
  getBalanceMes() {
    let hoy = new Date();
    return this.movimientosList.filter(t =>  new Date(t.fecha) > new Date(hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, '0') + "-1")).map(t => t).reduce((acc, value) => acc + value.precio, 0);
  }

  // Add new movement
  addMovimiento(){
    this.getUltimoId();

    let selectCategoria = '<select id="input-categoria" name="select" class="swal2-input">';
    for (let index = 0; index < this.categoriasList.length; index++) {
      selectCategoria += '<option value="'+ this.categoriasList[index].id + '">'+ this.categoriasList[index].nombre + '</option>';
      
    }
    selectCategoria += '</select>';

    Swal.fire({
      title: 'Add movement',
      html:
        '<input id="input-nombre" placeholder="Name" class="swal2-input">' + 
        '<input id="input-precio" placeholder="Price" class="swal2-input">' + selectCategoria +
        '<input id="input-fecha" type="date" class="swal2-input">',
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      let nombre = window.document.getElementById('input-nombre');
      let precio = window.document.getElementById('input-precio');
      let fecha = window.document.getElementById('input-fecha');
      let categoria = window.document.getElementById('input-categoria');
      let precioNum = Number((precio as HTMLInputElement).value);
      let categoriaNum = Number((categoria as HTMLInputElement).value);

      if(nombre && precio && fecha){
        let movimiento: Movimiento = {
          "id": this.ultimoId+1,
          "nombre": (nombre as HTMLInputElement).value,
          "precio": precioNum,
          "tipo": precioNum > 0 ? 1 : 0,
          "idCategoria": categoriaNum,
          "fecha": new Date((fecha as HTMLInputElement).value)
        };
        this.movimientoSvc.addMovimientos(movimiento).subscribe(movimiento => this.getMovimientos());

      }
    });
  }

  // Edit movements
  editMovimiento(id:number, nombre:string, precio:number, tipo:number, fecha:number, idCategoria: number){
    this.ultimoId = id;
    let fechaDate = new Date(fecha);
    let fechaString = fechaDate.getFullYear() + '-' + String(fechaDate.getMonth() + 1).padStart(2, '0') + '-' + String(fechaDate.getDate()).padStart(2, '0');

    let selectCategoria = '<select id="input-categoria" name="select" class="swal2-input">';
    for (let index = 0; index < this.categoriasList.length; index++) {
      if (idCategoria == index) {
        selectCategoria += '<option selected="true" value="'+ this.categoriasList[index].id + '">'+ this.categoriasList[index].nombre + '</option>';
      } else {
        selectCategoria += '<option value="'+ this.categoriasList[index].id + '">'+ this.categoriasList[index].nombre + '</option>';
      }
    }
    selectCategoria += '</select>';

    Swal.fire({
      title: 'Edit movement',
      html:
        '<input id="input-nombre" value="' + nombre + '" class="swal2-input">' +
        '<input id="input-precio" value="' + precio + '" class="swal2-input">' + selectCategoria +
        '<input id="input-fecha" type="date" value="' + fechaString + '" class="swal2-input">',
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      let nombre = window.document.getElementById('input-nombre');
      let precio = window.document.getElementById('input-precio');
      let fecha = window.document.getElementById('input-fecha');
      let categoria = window.document.getElementById('input-categoria');
      let precioNum = Number((precio as HTMLInputElement).value);
      let categoriaNum = Number((categoria as HTMLInputElement).value);

      if(nombre && precio && fecha){
        let movimiento: Movimiento = {
          "id": id,
          "nombre": (nombre as HTMLInputElement).value,
          "precio": precioNum,
          "tipo": precioNum > 0 ? 1 : 0,
          "idCategoria": categoriaNum,
          "fecha": new Date((fecha as HTMLInputElement).value)
        };
        this.movimientoSvc.updateMovimientos(movimiento, id).subscribe(movimiento => this.getMovimientos());
      }
    });
  }

  // Delete movements
  eliminarMovimiento(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.movimientoSvc.deleteMovimientos(id).subscribe(() => this.getMovimientos());
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  // Navegation function
  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }

}
