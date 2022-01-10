import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { GraficasComponent } from './componentes/graficas/graficas.component';
import { MovimientosComponent } from './componentes/movimientos/movimientos.component';

const routes: Routes = [
  {path:'', component: MovimientosComponent},
  {path:'categorias', component: CategoriasComponent},
  {path:'graficas', component: GraficasComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
