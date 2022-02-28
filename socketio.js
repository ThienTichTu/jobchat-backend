
var app = require('./app');

const db = require('./firebase-config/connectFirebase');
let UsersConnects = db.collection("usersConnects");
const User = db.collection("users")

const port = 4000;
const http = require('http');

const { Server } = require('socket.io');

const server = http.createServer(app)

var FielValue = require("firebase-admin").firestore.FieldValue;



const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ["GET", "POST"],
    }
})



io.on('connection', (socket) => {
    console.log("co nguoi connect >>> ", socket.id)

    socket.on("disconnect", () => {
        console.log(`${socket.id} vua ngat ket noi!!`)
        UsersConnects.where("idSocket", "==", socket.id).get()
            .then(rs => {
                const idUser = rs.docs.map(doc => doc.id)

                if (idUser[0]) {
                    UsersConnects.doc(idUser[0]).delete()

                }
            })
            .catch(err => console.log(err))
    })

    // Socket connect create user ========================
    socket.on("idClient_Connect", (data) => {
        console.log(`Socket on idClient_Connect ===============`)

        UsersConnects.where("id", "==", data.id).get()
            .then(rs => {
                const isUser = rs.docs.map(doc => doc.id)
                const Client = { ...data, idSocket: socket.id }
                if (!isUser[0]) {
                    UsersConnects.add(Client)
                } else {
                    UsersConnects.doc(isUser[0]).update({ idSocket: socket.id })
                    console.log("User dang online")
                }
            })
            .catch(err => console.log(err))
    })

    // Socket connect delete user ========================

    socket.on("idClient_disconnet", (data) => {

        console.log(`Socket on idClient_disconnect ===============`)

        UsersConnects.where("id", "==", data).get()
            .then(rs => {
                const iduser = rs.docs.map(doc => doc.id)
                UsersConnects.doc(iduser[0]).delete()
            })
            .catch(err => console.log(err))
    })
    // Socket on add friend message

    socket.on("add_friend", async (data) => {
        User.doc(data.idFind).update({
            Message: FielValue.arrayUnion({
                type: "add friend",
                state: "chua xem",
                data: {
                    idAdd: data.idAdd,
                    name: data.displayName,
                    avatar: data.avatar,
                }
            })
        })

        // UsersConnects.where("id", "==", data.idFind).get()
        //     .then(rs => {
        //         const idUser = rs.docs.map(doc => doc.id)

        //     })
        const userOnline = await UsersConnects.where("id", "==", data.idFind).get()
        const idUser = userOnline.docs.map(doc => doc.data())
        if (idUser[0]) {

            const { idSocket } = idUser[0]
            const userRealtime = await User.doc(data.idFind).get()
            console.log("send data to update")
            io.to(idSocket).emit("Server-send-Rendermess", userRealtime.data().Message)
        }


        // console.log(data)
    })




})




module.exports = server