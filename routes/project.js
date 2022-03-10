var express = require('express');
var router = express.Router();
// const Multer = require('../firebase-config/multer')
// const uploadImg = require("../firebase-config/uploadimg")
const { createProject, findProject, getProject, addProcess, deleteProcess } = require("../controller/project")


/* GET users listing. */
router.post('/create', createProject);
router.get('/find', findProject);
router.get('/get/:id', getProject);
router.post('/addprocess', addProcess);
router.post('/deleteprocess', deleteProcess);


module.exports = router;
