var express = require('express');
var router = express.Router();
const Multer = require('../firebase-config/multer')
const uploadImg = require("../firebase-config/uploadimg")
const { uploadImg_Chat, uploadImg_Chatcard } = require("../controller/chats")


/* GET users listing. */
router.post('/uploadImgChat', Multer.single("img_Chat"), uploadImg, uploadImg_Chat);
router.post('/uploadImgChatCard', Multer.single("img_Chatcard"), uploadImg, uploadImg_Chatcard);


module.exports = router;
