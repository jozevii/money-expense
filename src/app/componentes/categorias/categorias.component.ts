import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriasService } from 'src/app/services/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  // Initialization of global variables
  categoriasList: Categoria[] = [];
  categoriasListId: Categoria[] = [];
  displayedColumns: string[] = ['nombre', 'actions'];
  balanceMes = 0;
  ultimoId = 0;
  constructor(private categoriaSvc: CategoriasService, private router: Router) { }

  ngOnInit(): void {
    this.getCategorias();
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
    this.categoriaSvc.getCategorias()
    .subscribe((categorias) => {
      this.categoriasListId = categorias;
      this.categoriasListId.sort(function(a, b) {
        return a.id<b.id ? -1 : a>b ? 1 : 0;
      });
      this.ultimoId = this.categoriasListId[this.categoriasListId.length-1].id;
    });
  }

  // Add new category
  addCategoria(){
    this.getUltimoId();
    Swal.fire({
      title: 'Add category',
      html:
        '<input id="input-nombre" placeholder="Name" class="swal2-input">',
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      let nombre = window.document.getElementById('input-nombre');
      if(nombre){
        let categoria: Categoria = {
          "id": this.ultimoId+1,
          "nombre": (nombre as HTMLInputElement).value,
        }
        this.categoriaSvc.addCategorias(categoria).subscribe(categoria => this.getCategorias());
      }
    });
  }

  // Edit a category
  editCategoria(id:number, nombre:string){
    this.ultimoId = id;
    Swal.fire({
      title: 'Edit category',
      html:
        '<input id="input-nombre" value="' + nombre + '" class="swal2-input">',
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      let nombre = window.document.getElementById('input-nombre');

      if(nombre){
        let categoria: Categoria = {
          "id": id,
          "nombre": (nombre as HTMLInputElement).value,
        }

        this.categoriaSvc.updateCategorias(categoria, id).subscribe(categoria => this.getCategorias());
      }
    });
  }

  // Delete a category with NgCharts module
  eliminarCategoria(id:number){
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
        this.categoriaSvc.deleteCategorias(id).subscribe(() => this.getCategorias());
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

