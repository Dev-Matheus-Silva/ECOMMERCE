const router = require("express").router();

router.use("/usuarios", require("./usuarios"));

module.export = router;