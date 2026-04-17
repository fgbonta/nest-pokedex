import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB_URI: Joi.required(), // esta variable de entorno es obligatoria, no puede faltar
    MONGODB_USER: Joi.required(), // esta variable de entorno es obligatoria, no puede faltar
    MONGODB_PASSWORD: Joi.required(), // esta variable de entorno es obligatoria, no puede faltar
    MONGODB_DB: Joi.required(), // esta variable de entorno es obligatoria, no puede faltar
    PORT: Joi.number().default(3007), // si no se define la variable de entorno PORT, se usará el valor por defecto 3007
    DEFAULT_LIMIT: Joi.number().default(7), // si no se define la variable de entorno DEFAULT_LIMIT, se usará el valor por defecto 7
});