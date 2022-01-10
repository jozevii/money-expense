import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from './componentes/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import { MovimientosComponent } from './componentes/movimientos/movimientos.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { GraficasComponent } from './componentes/graficas/graficas.component';
import { NgChartsModule } from 'ng2-charts';
import {MatTabsModule} from '@angular/material/tabs';
 
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MovimientosComponent,
    CategoriasComponent,
    GraficasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    MatTableModule,
    NgChartsModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

