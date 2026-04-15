// esta funcion me va mapear mis variables de entorno 
// y me va a retornar un objeto con esas variables, para que yo pueda usarlo en mi aplicacion
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 3000,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
})