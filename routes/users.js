var express = require('express');
var router = express.Router();
const Multer = require('../firebase-config/multer')
const uploadImg = require("../firebase-config/uploadimg")
const {
    addFriend, unFriend, uploadAvatar, updateInfor, findUser
    , getMessUser

} = require('../controller/user');

/* GET users listing. */
router.post('/addFriend', addFriend);

router.get('/unFriend', unFriend);

router.post('/uploadAvatar', Multer.single("avatar_update"), uploadImg, uploadAvatar);

router.post("/updateUser", updateInfor)

router.get("/findUser/:phone", findUser)

router.get("/getMessage", getMessUser)

module.exports = router;