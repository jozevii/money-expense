import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { Movimiento } from 'src/app/interfaces/movimiento.interface';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MovimientosService } from 'src/app/services/movimientos.service';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  // Initialization of global variables
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart2: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart3: BaseChartDirective | undefined;
  movimientosList: Movimiento[] = [];
  fechaList: string[] = [];
  catListP: string[] = [];
  catListN: string[] = [];
  movimientosListValorP: number[] = [];
  movimientosListValorN: number[] = [];
  catListValorP: number[] = [];
  catListValorN: number[] = [];
  categoriasList: Categoria[] = [];
  stringCat = "";
  stringCatValor = "";
  contCat = 0;
  
  constructor(private categoriaSvc: CategoriasService, private movimientoSvc: MovimientosService) { 
    this.categoriaSvc.getCategorias()
      .subscribe((categorias) => {
        this.categoriasList = categorias;
     });
     this.inicializarValores();
    }

  ngOnInit(): void {}

  // Fill all the variables with the data
  inicializarValores(){
    this.movimientoSvc.getMovimientos()
    .subscribe((movimientos) => {
      this.movimientosList = movimientos;
      this.movimientosList.sort(function(a, b) {
        return a.fecha<b.fecha ? -1 : a>b ? 1 : 0;
      });
    
      for (let index = 0; index < movimientos.length; index++) {
        let fecha = new Date(movimientos[index].fecha);
        let fechaString = String(fecha.getMonth() + 1) + '/' + String(fecha.getFullYear());
        let catString = this.categoriasList[movimientos[index].idCategoria].nombre;
        if (this.fechaList.includes(fechaString)) {
          if (movimientos[index].precio > 0) {
            this.movimientosListValorP[this.fechaList.indexOf(fechaString)] = this.movimientosListValorP[this.fechaList.indexOf(fechaString)] | 0;
            this.movimientosListValorP[this.fechaList.indexOf(fechaString)] += movimientos[index].precio;
          } else {
            this.movimientosListValorN[this.fechaList.indexOf(fechaString)] = this.movimientosListValorN[this.fechaList.indexOf(fechaString)] | 0;
            this.movimientosListValorN[this.fechaList.indexOf(fechaString)] -= movimientos[index].precio;
          }
          
        } else {
          if (movimientos[index].precio > 0) {
            let lenght = this.fechaList.push(fechaString);
          this.movimientosListValorP[lenght-1] = movimientos[index].precio;
          } else {
            let lenght = this.fechaList.push(fechaString);
          this.movimientosListValorN[lenght-1] = movimientos[index].precio*(-1);
          }
        }
        
        if (movimientos[index].precio > 0) {
          if (this.catListP.includes(catString)) {
          
            this.catListValorP[this.catListP.indexOf(catString)] = this.catListValorP[this.catListN.indexOf(catString)] | 0;
            this.catListValorP[this.catListP.indexOf(catString)] += movimientos[index].precio;
          } else {
            let lenght = this.catListP.push(catString);
            this.catListValorP[lenght-1] = movimientos[index].precio;
            this.contCat++;
          }
        } else {
          if (this.catListN.includes(catString)) {
            this.catListValorN[this.catListN.indexOf(catString)] = this.catListValorN[this.catListN.indexOf(catString)] | 0;
            this.catListValorN[this.catListN.indexOf(catString)] -= movimientos[index].precio;
          } else {
            let lenght = this.catListN.push(catString);
            this.catListValorN[lenght-1] = movimientos[index].precio*(-1);
            this.contCat++;
          }
        }
      }
   });
  }


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.fechaList,
    datasets: [
      { data: this.movimientosListValorN, label: 'Waste' },
      { data: this.movimientosListValorP, label: 'Income' }
    ]
  };

  // Events for clicking and hover
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  // Fill of the charts
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.catListP,
    datasets: [ {
      data: this.catListValorP
    } ]
  };

  public pieChartData2: ChartData<'pie', number[], string | string[]> = {
    labels: this.catListN,
    datasets: [ {
      data: this.catListValorN
    } ]
  };

  public pieChartType: ChartType = 'pie';

  public randomize(): void {
    this.chart2?.update();
    this.chart?.update();
  }
}
