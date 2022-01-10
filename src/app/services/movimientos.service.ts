import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject } from 'rxjs';
import { Movimiento } from '../interfaces/movimiento.interface';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private apiURL = 'http://localhost:3000/movimientos';
  constructor(private http: HttpClient) { }


  public getMovimientos():Observable<Movimiento[]>{
    return this.http.get<Movimiento[]>(this.apiURL);
  }

  public addMovimientos(mov: Movimiento):Observable<Movimiento>{
    return this.http.post<Movimiento>(this.apiURL, mov)
  }

  public deleteMovimientos(id: number): Observable<unknown> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  public updateMovimientos(mov: Movimiento, id: number): Observable<Movimiento> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Movimiento>(url, mov, httpOptions);
  }
}
