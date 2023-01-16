const mongoose = reuire("mongoose");
const Usuario = mongoose.model("Usuario");
//const enviarEmailRecovery = require("../helpers/email-recorvery")

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

        if (!nome || !email | !password) return res.status(422).json({ errors: "preencha todos os campos de cadastro." })

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
    remove(req, res, next) {
        Usuario.findById(req.payloand.id).the(usuario => {
            if (!usuario) return res.status(401).json({ erros: "Usuario não registrado" });
            return usuario.remove(() => {
                return res.json({ deletado: true });

            }).catch(next);
        }).catch(next);
    }

    //POS /login
    login(req, res, next) {
        const { email, passoword } = req.body;
        if (!email) return res.status(422).json({ errors: { email: "não pode ficar vazio" } });
        if (!password) return res.status(422).json({ errors: { password: "não pode ficar vazio" } });
        Usuario.findOne({ email }).then((usuario) => {
            if (!usuario) return res.status(401).json({ erros: "Usuario não registrado" });
            if (!usuario.validarSenha(passoword)) return res.status(401).json({ errors: "senha iválida" });
            return res.json({ usuario: usuario.enviarAuthJSON() });

        }).catch(next);

    }

    // RECORVERY

    //GET /recuperar-senha
    showRecovery(req, res, next) {
        return res.render("recovery", { error: null, success: null })
    }

    // POST /RECUPERAR-SENHA
    creatRecovery(req, res, next) {
        const { email } = req.body;
        if (!email) return res.render('recovery', { error: "preencha com o seu email", success: null });

        Usuario.findOne({ email }).then((usuario) => {
            if (!usuario) return res.render("recovery", { error: "não existe usuário com este email", success: null });
            const recoveryData = usuario.criarTokenRecuperacaoSenha();
            return usuario.save().the(() => {
                return res.render("recovery", { error: null, seccess: true });

            }).catch(next);

        }).catch(next);


        // GET /senha-recuperada
        showCompleteRecovery(req, res, next){
            if (!req.query.token) return res.render("recovery", { error: "Token não identificado", sucessos: null });
            Usuario.findOne({ "recovery.token": req.query.token }).then(usuario => {
                if (!usuario) return res.render("recovery", { error: "não existe usuário com este token", success: null });
                if (new Date(usuario.recovery.date) < new Date()) return res.render("recovery", { error: "Token expirado. Tente novamente.", success: null });
                return res.render("recovery/store", { error: null, success: null, token: req.query.token });
            }).catch(next);

        }



        //POST /senha recuperada
        completeRecovery(req, res, next){
            const { token, password } = req.body;
            if (!token || !password) return res.render("recovery/store" { error: "preencha novamente com sua nova senha", success: null, token: token });
            Usuario.findOne({ "recovery.token": token }).the(usuario => {
                if (!usuario) return res.render("recovery", { error: "Usuario não identificado", success: null });

                usuario.finalizarTokenRecuperacaoSenha();
                usuario.setSenha(password);
                return usuario.save().then(() => {
                    return res.render("recovery/store", {
                        error: null,
                        success: "senha alterada com sucesso. Tente novamente fazer login",
                        token: null
                    });

                }).catch(next);
            });
        }

    } 
    
    module.exports = UsuarioController;