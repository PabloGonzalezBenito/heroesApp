import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {
  //Creamos un formulario reactivo
  public heroForm = new FormGroup({
    id: new FormControl<string>(""),
    //nonNullable:true: evita que un valor pueda ir vacío
    superhero: new FormControl<string>("", { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(""),
    first_appearance: new FormControl(""),
    characters: new FormControl(""),
    alt_img: new FormControl(""),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
    ) { }


  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    console.log();
    return hero;

  }


  ngOnInit(): void {
    //si la ruta no incluye 'edit' no hago nada
    if( !this.router.url.includes('edit')) return;
    //en este punto, nos hemos asegurado de que estamos en la parte de editar heroe
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroById(id)),

    ).subscribe(hero => {
      if(!hero) return this.router.navigateByUrl('/');

      //la siguiente instrucción nos rellena los campos del formulario al ir a la pantalla de editar
      this.heroForm.reset(hero);
      return;
    })
  }


  onSubmit(): void {
    if (this.heroForm.invalid) return;

    //si el heroe que se esta rellenando en el form tiene un id, es que ya existe,
    //por lo tanto queremos actualizarlo
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`)
        });
      return;
    }

    //si se llega hasta aqui, quiere decir que no se cumplió la condicion del if anterior,
    //por tanto el heroe en el form no tiene id, por tanto no existe, por tanto hay que crearlo
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit',hero.id]);
        this.showSnackbar(`${hero.superhero} created!`);
      })

  }

  onDeleteHero(){
    if( !this.currentHero.id ) throw Error('Hero id es required');
    //el siguiente codigo es copiado del apartado Dialog de Angular Materials
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value,
      });

      dialogRef.afterClosed()
      .pipe(
        //filter: si esa condición se cumple, lo deja pasar, si no lo bloquea
        filter((result:boolean) => result===true),
        //gracias al filter, aqui ya se asegura que el usuario confirmó borrar heroe
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        //Dejo pasar únicamente si el heroe fue eliminado
        filter((wasDeleted:boolean) => wasDeleted===true),
        )
      //el subscribe se va a disparar solo si hace todo lo que esta dentro del .pipe
      .subscribe(() =>{
        this.router.navigate(['/heroes']);
      })
  
      // dialogRef.afterClosed().subscribe(result => {
      //   if(!result) return;


      //   this.heroesService.deleteHeroById(this.currentHero.id).subscribe(
      //     wasDeleted => {
      //       if( wasDeleted ){
      //         this.router.navigate(['/heroes']);
      //       }
      //     }
      //   );
        
      // });
    

  }

  showSnackbar(message:string):void{
this.snackbar.open( message, 'done', {
  duration:2500,
} )
  }

}
