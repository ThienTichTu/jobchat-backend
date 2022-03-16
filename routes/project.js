var express = require('express');
var router = express.Router();
// const Multer = require('../firebase-config/multer')
// const uploadImg = require("../firebase-config/uploadimg")
const { createProject, findProject,
    getProject, addProcess, deleteProcess, createCard,
    updateCardlocation, updateCard_data, deleteCard,
    getDataChat_Card
} = require("../controller/project")


/* GET users listing. */
router.post('/create', createProject);
router.get('/find', findProject);
router.get('/get/:id', getProject);
router.post('/addprocess', addProcess);
router.post('/deleteprocess', deleteProcess);
router.post('/createcard', createCard);
router.post('/updatecardlocation', updateCardlocation);
router.post('/updatecard-data', updateCard_data);
router.post('/deletecard-data', deleteCard);

router.post('/chat', getDataChat_Card);


module.exports = router;
