var express = require('express');
var router = express.Router();
var auth = require("../firebase-config/auth")

const Multer = require('../firebase-config/multer')
const uploadImg = require("../firebase-config/uploadimg")
const {
    addFriend, unFriend, uploadAvatar, updateInfor, findUser
    , getMessUser, getFriend, getChatRoom

} = require('../controller/user');

/* GET users listing. */
router.post('/addFriend', addFriend);

router.get('/unFriend', unFriend);

router.post('/uploadAvatar', Multer.single("avatar_update"), uploadImg, uploadAvatar);

router.post("/updateUser", auth, updateInfor)

router.get('/getFriend', getFriend)

router.get("/findUser/:key", findUser)

router.get("/getMessage", auth, getMessUser)

router.post("/getdataChatRoom", getChatRoom)

module.exports = router;