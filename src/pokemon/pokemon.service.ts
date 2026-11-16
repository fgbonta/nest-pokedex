import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')!;
    this.defaultOffset = configService.get<number>('defaultOffset')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      // const newPokemon = new this.pokemonModel(createPokemonDto);
      // const pokemon = await newPokemon.save();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: unknown) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { offset = this.defaultOffset, limit = this.defaultLimit } = paginationDto
    return this.pokemonModel.find()
      .skip(offset)
      .limit(limit)
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto?.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto,
      };

    } catch (error: unknown) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // Dispara los hooks de instancia (pre/post de borrado)
    // Menos eficiente
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // NO dispara los hooks de instancia (pre/post de borrado)
    // Más eficiente
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }

    return;
  }

  private handleExceptions(error: unknown) {
    const errorResponse = error as { code?: number; keyValue?: Record<string, unknown> };
    if (errorResponse.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(errorResponse.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException('Can\'t create or update Pokemon - Check server logs');
  }
}
