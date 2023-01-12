const router = rquire("express").Rauter();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuarioController");
const usuario = require("../../../models/usuario");


const usuarioController = new UsuarioController();

router.get("/", auth.required, usuarioController.index);
router.get("/:id", auth.required, usuarioController.show);


router.post("/login", usuarioController.login);
router.post("/registrar",usuarioController.store);
router.put("/", auth.required, usuarioController.update);
router.delete("/", auth.required, usuarioController.remove);

router.get("/recuperar-senha", usuarioController.showRecovery);
router.post("/recuperar-senha", usuarioController.creatRecovery);
router.get("/senha-recuperada", usuarioController.showCompleteRecovery);
router.post("/senha-recuperada", usuarioController.completeRecovery);

module.export = router;






