import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) { }

  async executeSeed() {

    // fetch funciona en Node.js a partir de la versión 18. 
    // Puedes instalar un paquete que proporcione la funcionalidad de fetch en Node.js, como node-fetch.

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=650');

    const pokemons: { name: string; no: number }[] = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return {
        name,
        no,
      };
    });

    await this.pokemonModel.deleteMany({});
    await this.pokemonModel.insertMany(pokemons, { ordered: false });

    return 'Seed executed';
  }
}
