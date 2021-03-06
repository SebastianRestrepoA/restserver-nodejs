const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')
const app = express();



app.get('/usuario', verificaToken, (req, res)=> {

    return res.json({

        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    })

        // res.json('Get usuario local')
    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;

    // traer solo los campos nombre y email.

    Usuario.find({},'nombre email')
            .skip(desde)
            .limit(hasta)
            .exec((err, usuarios)=>{

                if (err){

                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({},(err, conteo)=>{

                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                })  
                });
            }); 

  })
  
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res)=> {
  
    let body = req.body;

    // Bcrypt para encriptar contraseñas e información.    

    let usuario = new Usuario({

        nombre: body.nombre,
        email : body.email,
        password: bcrypt.hashSync(body.password,10) ,
        role: body.role
    });

    // usuarioDB es la respuesta del usuario que se guardo en mongo

    usuario.save((err, usuarioDB)=>{

        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        // usuarioDB.password = null; 

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

  });
  
  app.put('/usuario/:id',  [verificaToken, verificaAdminRole], (req, res)=> {

    // _.pick sirve para obtener los valores de los keys listados 
  
      let id = req.params.id;
      let body = _.pick(req.body,['nombre', 'email', 'img', 'role', 'estado']);

    // new: Esta opción es usada para retornar la actualización de la base de datos por id.
    // runValidators: Esta opción es usada para realizar las validaciones de la entrada put. 

      Usuario.findByIdAndUpdate(id,body, {new: true, runValidators: true}, (err, usuarioDB)=>{
          
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
        
      })
  });
  
  
  app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) =>{
    //   res.json('delete usuario')

    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{
    
    let cambiaEstado = {
        estado: false

    };
    

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true}, (err,usuarioBorrado)=>{


        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarioBorrado
        })


    })


  });
  
  module.exports = app;