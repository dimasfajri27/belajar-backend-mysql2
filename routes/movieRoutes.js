const express = require("express")
const router = express.Router();

const movieController = require("../controllers/movieController");

const auth = require("../middlewares/auth");

const {validateMovieCreate, validateMovieUpdate} = require("../middlewares/validation");

// rute public //tidak perlu token
router.get("/",movieController.getall);
router.get("/:id", movieController.getById);

// rute proctected // perlu token - lewat middlware auth dulu;
router.post("/", auth,validateMovieCreate, movieController.create);
router.put("/:id", auth,validateMovieUpdate, movieController.update);
router.delete("/:id", auth, movieController.remove);

module.exports = router;


