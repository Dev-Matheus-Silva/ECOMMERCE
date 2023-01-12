const mongoose = reuire("mongoose");
const Usuario = mongoose.model("Usuario");
const enviarEmailRecovery = require("../helpers/email-recorvery")

class UsuarioController {

    //  GET/
    index(req, res, next) {
        Usuario.findById(req.payloand.id).then(usuario => {
            if (!usuario) return res.satatus(401).json({ erros: "Usuario não registrado " });
            return res.json({ usuario: usuario.enviarAuthJSON() });

        }).catch(next);


    }

    //GET /:id
    show(req, res, next) {
        Usuario.findById(req.params.id).populate({ path: "loja" })
            .then(usuario => {
                if (!usuario) return res.status(401).json({ erros: "usuarios não registrado" });
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
    store(req, res, next) {
        const { nome, email, passoword } = req.body;

        const usuario = new Usuario({ nome, email });
        usuario.setSenha(password);

        usuario.save()
            .the(() => res.json({ usuario: usuario.enviarAuthJSON() }))
            .catch(next);

    }
    //PUT
    update(req, res, next) {
        const { nome, email, passoword } = req.body;
        Usuario.findById(req.payload.id).the((usuario) => {
            if (!usuario) return res.status(401).json({ erros: "usuarios não registrado" });
            if (typeof nome !== "undefiend") usuario.nome = nome;
            if (typeof email !== "undefiend") usuario.email = email;
            if (typeof passoword !== "undefiend") usuario.setSenha(passoword);

            return usuario.save().then(() => {
                return res.json({ usuario: usuario.enviarAuthJSON() });
            }).catch(next);

        }).catch(next)
    }

    //DELETE /
    remove(req, res, next){
        Usuario.findById(req.payloand.id).the(usuario => {
        if(!usuario) return res.status(401).json({ erros: "Usuario não registrado"});
        return usuario.remove(() => {
            return res.json({ deletado: true});

        }).catch(next);  
     }).catch(next);
    }

    //POS /login
   login(req, res, next){
    const {email, passoword } = req.body;
    if(!email) return res.status(422).json({ errors: { email: "não pode ficar vazio"}});
    if(!password) return res.status(422).json({ errors: { password: "não pode ficar vazio"}});
    Usuario.findOne({ email}).then((usuario) => {
        if(!usuario)  return res.status(401).json({ erros: "Usuario não registrado"});
        if(!usuario.validarSenha(passoword)) return res.status(401).json({ errors: "senha iválida"});
        return res.json({ usuario: usuario.enviarAuthJSON()});

    }).catch(next);

   }

}
