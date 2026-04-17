// esta funcion me va mapear mis variables de entorno 

import { mongo } from "mongoose";

// y me va a retornar un objeto con esas variables, para que yo pueda usarlo en mi aplicacion
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodbUri: process.env.MONGODB_URI,
    mongodbUser: process.env.MONGODB_USER,
    mongodbPassword: process.env.MONGODB_PASSWORD,
    mongodbDb: process.env.MONGODB_DB,
    port: process.env.PORT || 3001,
    defaultLimit: +(process.env.DEFAULT_LIMIT || 6),
})