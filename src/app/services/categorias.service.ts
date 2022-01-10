import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';
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
export class CategoriasService {
  private apiURL = 'http://localhost:3000/categorias';
  constructor(private http: HttpClient) { }


  public getCategorias():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.apiURL);
  }

  public addCategorias(cat: Categoria):Observable<Categoria>{
    return this.http.post<Categoria>(this.apiURL, cat)
  }

  public deleteCategorias(id: number): Observable<unknown> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  public updateCategorias(cat: Categoria, id: number): Observable<Categoria> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Categoria>(url, cat, httpOptions);
  }
}