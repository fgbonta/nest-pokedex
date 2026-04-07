import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// cada instancia de esta clase representará un pokemon
// la anotación @Schema() indica que esta clase es un esquema de Mongoose, lo que permite definir la estructura de los documentos en la colección de MongoDB
// Document es la clase base de Mongoose, que proporciona métodos para interactuar con la base de datos
@Schema()
export class Pokemon extends Document {

    //id: string; // mongodb genera un id automáticamente, no es necesario definirlo aquí

    @Prop({
        unique: true, // el nombre del pokemon debe ser único
        index: true, // se crea un índice para mejorar el rendimiento de las consultas por nombre   
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}

/*
SchemaFactory.createForClass(Pokemon) toma la definición decorada de la clase Pokemon
y la transforma en un objeto Schema que Mongoose puede usar para validar, guardar y leer documentos en MongoDB. 
 */
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
