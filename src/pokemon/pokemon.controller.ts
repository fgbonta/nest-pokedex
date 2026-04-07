import { Controller, Get, Post, Body, Patch, Param, Delete, /* HttpCode, HttpStatus */ } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {

  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.pokemonService.findOne(term);
  }

  @Post()
  //@HttpCode(HttpStatus.OK)
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonService.create(createPokemonDto);
  }

  @Patch(':term')
  async update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto
  ) {
    return await this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.pokemonService.remove(id);
  }
}
