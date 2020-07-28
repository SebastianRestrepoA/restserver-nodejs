const jwt = require('jsonwebtoken');

// ===================================================
//                      Verificar token
// ===================================================


let verificaToken = ( req ,  res, next) =>{

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED , (err, decoded)=>{

        if ( err ) {

            return res.status(401).json({

                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};


// ===================================================
//                      Verificar adminRole
// ===================================================


let verificaAdminRole = ( req ,  res, next) =>{

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE'){
        next();
    }else{

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }   

}

module.exports = {
    verificaToken,
    verificaAdminRole
}