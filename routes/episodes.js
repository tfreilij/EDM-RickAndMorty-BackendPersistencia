var express = require("express");
var router = express.Router();
/* Este controlador no fue generado de forma automática, lo agregamos nosotros.

Intenten de completarlo para trabajar con los capítulos de la serie.

*/
router.get("/", function (req, res, next) {
  res.send("Este es un endpoint de los episodios");
});

module.exports = router;
