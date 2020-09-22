// ====================
// Variables
// ==================== 
const development = 'dev';


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
let urlMongoDB;
/*
if (process.env.NODE_ENV === development)
    urlMongoDB = 'mongodb://localhost:27017/cafe';
else*/
urlMongoDB = 'mongodb+srv://admin:deme251193@cluster0.ywpd4.mongodb.net/cafe?retryWrites=true&w=majority';
process.env.URL_MONGO = urlMongoDB;