import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

declare var $: any;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  pokemons: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Número de Pokémon por página
  totalPokemons: number = 0;
  selectedPokemon: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(page: number = 1): void {
    const offset = (page - 1) * this.pageSize;
    this.http.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${this.pageSize}`)
      .subscribe((data: any) => {
        const requests = data.results.map((pokemon: any) => this.http.get(pokemon.url).toPromise());
        Promise.all(requests).then((responses: any[]) => {
          this.pokemons = responses.map((response: any) => ({
            ...response,
            image: response.sprites.front_default
          }));
          this.totalPokemons = data.count;
        });
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPokemons(this.currentPage);
  }

  showDetails(pokemon: any): void {
    this.selectedPokemon = pokemon;
    $('#pokemonModal').modal('show');
  }
}
