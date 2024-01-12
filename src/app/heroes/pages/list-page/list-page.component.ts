import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {
  public heroes: Hero[] = [];
  constructor(private heroesService: HeroesService) {
  }

  obtenerHeroes(): void {
    this.heroesService.getHeroes().subscribe(
      (data => {
        this.heroes = data;
        console.log(data);
      })
      
    )
  }
  
  
  ngOnInit(): void {
    this.obtenerHeroes();    
  }
}
