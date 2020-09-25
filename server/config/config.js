// ====================
// Variables
// ==================== 
const development = 'dev';
const production = 'pro';


// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;


// ===================
// Entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || development;


// ===================
// Caducidad del token
// ===================
process.env.TOKEN_TIME = 60 * 60 * 24 * 30;


// ===================
// Seed del autenticación
// ===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


// ===================
// Base de datos
// ===================
const BBDDLocal = 'mongodb://localhost:27017/cafe';
if (process.env.NODE_ENV === development)
    process.env.URL_MONGO = BBDDLocal;
else
    process.env.URL_MONGO = process.env.URL_MONGO_PROD || BBDDLocal;


// ===================
// Entorno
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '266309840529-d6860tpptokhk3um0llt8gf6ki4f53ai.apps.googleusercontent.com';