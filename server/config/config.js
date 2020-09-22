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
// Base de datos
// ===================

if (process.env.NODE_ENV === development)
    process.env.URL_MONGO = 'mongodb://localhost:27017/cafe';
else
    process.env.URL_MONGO = process.env.URL_MONGO_PROD;