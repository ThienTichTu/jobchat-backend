var admin = require("firebase-admin");
const BUCKET = "jobchat-35964.appspot.com"
const bucket = admin.storage().bucket()

const uploadImg = (req, res, next) => {
    if (!req.file) {
        console.log("ko co file")
        return next();
    }
    const img = req.file
    const nameFile = Date.now() + "." + img.originalname.split(".").pop()
    const file = bucket.file(nameFile)

    const stream = file.createWriteStream({
        metadata: {
            contentType: img.mimetype,
        }
    })

    stream.on("error", (e) => {
        console.log(e)
    })

    stream.on("finish", async () => {
        await file.makePublic();

        req.file.filebaseUrl = `https://storage.googleapis.com/${BUCKET}/${nameFile}`
        next();
    })

    stream.end(img.buffer)
}

module.exports = uploadImg;