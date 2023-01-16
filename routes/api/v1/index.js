const router = require("express").Router();

router.use("/usuarios", require("./usuarios"));

module.export = router;