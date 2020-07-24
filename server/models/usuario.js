const mongoose = require('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message : '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },

    email:{
        type: String,
        unique: true,
        required: [true, ' El email es necesario']
    },

    password:{
        type: String,
        required: [true, ' El password es obligatorio']
    },

    img:{
        type: String,
        required: false
    },

    role:{ 

        type: String,     
        default: 'USER_ROLE',
        enum: rolesValidos
    },

    estado:{
        type: Boolean,
        default: true
    },

    google:{
        type: Boolean,
        default: false
    },
});

// Para configurar la respuesta de la BD. Por ej: eliminar la una contraseña. userObject obtiene la respuesta de la BD en JSON.
usuarioSchema.methods.toJSON = function(){

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin( uniqueValidator , {
    message: '{PATH} debe ser unico '
})
module.exports = mongoose.model('Usuario', usuarioSchema);