var express = require('express');
var router = express.Router();
// const Multer = require('../firebase-config/multer')
// const uploadImg = require("../firebase-config/uploadimg")
const { createProject, findProject } = require("../controller/project")


/* GET users listing. */
router.post('/create', createProject);
router.get('/find', findProject);


module.exports = router;
