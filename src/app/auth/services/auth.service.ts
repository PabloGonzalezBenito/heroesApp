import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = environments.baseUrl;
    private user?: User;

    constructor(private http: HttpClient) { }

    get currentUser(): User | undefined {
        if (!this.user) return undefined;
        //para no retornar el objeto por referencia, sino un clon del mismo,
        //utilizamos la funcion structuredClone
        //Tambien se podria utilizar el spread operator: return {...this.user}
        return structuredClone(this.user);
    }


    login(email: string, password: string): Observable<User> {
        return this.http.get<User>(this.baseUrl + "/users/1")
            .pipe(
                tap(user => this.user = user),
                tap(user => localStorage.setItem('token', 'fqioh41o3hrnf.r1r31.fe1r1'))
            )
    }

    //conectar checkAuthtentication para verificar si esta autenticado,
    //si lo está, no se puede ver la pantalla de login
    checkAuthentication(): Observable<boolean>{
        if (!localStorage.getItem('token')) return of(false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(this.baseUrl + "/users/1")
            .pipe(
                tap(user => this.user = user),
                map(user => !!user),
                catchError(err => of(false))
            )
    }

    logout() {
        this.user = undefined;
        localStorage.clear();
    }

}