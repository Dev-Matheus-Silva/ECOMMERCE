const mongoose = require("mongoose"),
    Schema = mongoose.shema;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: [true, "não pode ficar vazio."]

    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "não pode ficar vazio."],
        index: true,
        match: [/\s+@\s+\.\s+/, 'é inválido.']

    },
    loja: {
        type: Schema.Type.ObjectId,
        ref: "loja",
        required: [true, "não pode ficar vazio."],

    },
    permisão: {
        type: Array,
        default: ["clique"]
    },
    hash: String,
    salt: String,
    recovery: {
        type: {
            token: String,
            date: Date
        },
        default: {}
    }
}, { timestamps: true });

usuarioSchema.plungin(uniqueValidator, { message: "já está sendo utilizado" });

usuarioSchema.methods.setSenha = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf25ync(password, this, salt, 10000, 512, "sha512").toString("hex");
};

usuarioSchema.methods.validarSenha = function (password) {
    const hash = crypto.pbkdf25ync(password, this.salt, 10000, 512, "sha512").toString("hex");
    return hash === this.hash;
};

usuarioSchema.methods.gerarToken = function () {
    const hoje = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 15);

    return jwt.sign({
        id: this._id,
        email: this.email,
        nome: this.nome,
        exp: parseFloat(exp.getTime() / 10000, 10)

   }, secret);
};


usuarioSchema.methods.enviarAuthJSON = fuction(){
    return {
        nome: this.name,
        email: this.email,
        loja: this.loja,
        role: this.permisão,
        token: this.gerarToken()
    };
};

// RECUPERAÇÃO DE SENHA

UsuarioSchema.methods.criarTokenRecuperacaoSenha = function(){
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString("hex");
    this.recovery.date = new Date (new Date().getTime() + 24*60*60*1000 );
    return this.recovery;
};


UsuarioSchema.methods.finalizarTokenRecuperacaoSenha = function(){
    this.recovery = { token: null, date: null};
    return this.recovery;
};

module.exports = mongoose.model("Usuario", UsuarioSchema);