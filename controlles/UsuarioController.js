const mongoose = reuire("mongoose");
const Usuario = mongoose.model("Usuario");
const enviarEmailRecovery = require("../helpers/email-recorvery")

class UsuarioController {
    
    //  GET/
    index(req, res , next){
        Usuario.findById(req.payloand.id).then(usuario =>{
            if(!usuario) return res.satatus(401).json({ erros:"Usuario não registrado "});
            return res.json({ usuario: usuario.enviarAuthJSON()});

        }).catch(next);


    }

    //GET /:id
    show(req, res ,next){
        Usuario.findById(req.params.id).populate({ path: "loja"})
        .then(usuario =>{
            if(!usuario) return res.status(401).json({ erros: "usuarios não registrado"});
            return res.json({
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email,
                    permissao: usuario.permissao,
                    loja: usuario.loja

                }

            });
        }).catch(next);
    }
        //POST /REGISTRAR
        store(req, res, next){
            const {nome, email, passoword } = req.body;

            const usuario = new Usuario({ nome, email});
            usuario.setSenha(password);

            usuario.save()
            .the(() => res.json({ usuario: usuario.enviarAuthJSON() }))
            .catch(next);
        }
    }
