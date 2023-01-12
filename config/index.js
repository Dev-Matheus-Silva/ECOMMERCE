module.exports = {
    secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "glgl236gsd65hj65h6jhj66t6rey65yhh566ghh33h65g6dsf6g6g5h6fu8th556fg65",
    api: process.env.NODE_ENV === "production" ? "https://api.loja.teste.ampliee.com" : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production" ? "https://loja.teste.ampliee.com" : "http://localhost:8000"
};
