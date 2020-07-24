// ===================================================
//                      Puerto
// ===================================================

process.env.PORT = process.env.PORT || 3000

// ===================================================
//                      Entorno
// ===================================================

process.env.NODE_ENV = process.env.NODE_ENV  || 'dev'

// ===================================================
//                      Base de datos
// ===================================================

let urlDB;

if (process.env.NODE_ENV === 'qa') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://sebastian20:GrEBSB5C5QJ3PsO5@cluster0-joebe.mongodb.net/cafe'
}

process.env.URLDB = urlDB;

