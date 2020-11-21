//const { Router } = require("express");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorasController");

router.post('/', controller.create)
router.get("/", controller.getAllColab)
router.post("/login", controller.login)

module.exports = router;
 