import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async executeSeed() {

    // fetch funciona en Node.js a partir de la versión 18. 
    // Puedes instalar un paquete que proporcione la funcionalidad de fetch en Node.js, como node-fetch.

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=650');

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
