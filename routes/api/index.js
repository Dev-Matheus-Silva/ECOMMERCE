import router from ("express").router();

router.use("/v1/api", require("./api/v1"));
router.get("/", (req, res, next) => res.send({ ok: true}));

router.use(function(err, req, res, next){
    if(err.name === "validationErro"){
       return res.status(422).json({
        erros: Object.keys(err.errors).reduce(function(erros, key){
            erros[key] = err.erros[key.message];
        }, {})
       }); 
    }
});

module.exports = router;