import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) {
      throw Error('Hero id is required');
    }
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  //Nosotros buscamos devolver un booleano:
  //false si hubo algun error, o true si se elimino correctamente el heroe
  //pero nuestro endpoint por defecto no devuelve nada
  //por ello, utilizamos el .pipe, el .catchError y el .map
  deleteHeroById(id: string): Observable<boolean> {

    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      //con el map transformamos la respuesta
      map(resp => true),
      //si hay algun error, retornamos un valor de false con catchError
      catchError(error => of(false)),
    )
    ;
  }



}
