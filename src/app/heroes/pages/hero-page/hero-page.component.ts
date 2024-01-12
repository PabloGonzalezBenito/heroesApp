import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {
goBack() {
this.router.navigate(['/heroes/list']);
}

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        //hacemos que la peticion tarde un segundo en ejecutarse para comprobar el
        //funcionamiento del spinner
        delay(1000),
        //mediante switchMap modifico el observable para que al hacer el subscribe
        //ya se le haya pasado por la funcion del Servicio que hace la peticion http.
        //{ id } se le pasa al servicio el id desestructurado
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe(hero => {
        console.log(hero);
        //Si no se encontro un heroe (hero=undefined) redirige al componente list
        if(!hero){
          return this.router.navigate([ '/heroes/list' ]);
        }

        //Si se encontro un heroe
        this.hero = hero;
        console.log(hero);
        
        return;
      })
  }


}
