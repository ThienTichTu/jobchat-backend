
var app = require('./app');
const {
    getData_Byid,
    addFriend_Byid,
    findUser_Online,
    getListIdUserOnline
} = require('./firebase-config/Query')
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
    socket.on("idClient_Connect", async (data) => {
        console.log(`Socket on idClient_Connect =============== ${data.id}`)

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

        const listFriends = await getData_Byid(User, data.id)
        const userOnline = await UsersConnects.get()

        userOnline.forEach(user => {
            if (listFriends.friends.includes(user.data().id)) {
                io.to(user.data().idSocket).emit("Server_Mess_Useronline", data.id)
            }
        })
    })


    // Socket connect delete user ========================

    socket.on("idClient_disconnet", async (data) => {

        console.log(`Socket on idClient_disconnect ===============`)

        UsersConnects.where("id", "==", data).get()
            .then(rs => {
                const iduser = rs.docs.map(doc => doc.id)
                UsersConnects.doc(iduser[0]).delete()
            })
            .catch(err => console.log(err))

        const userOffline = await getData_Byid(User, data)
        const userOnline = await UsersConnects.get()

        userOnline.forEach(user => {
            if (userOffline.friends.includes(user.data().id)) {
                io.to(user.data().idSocket).emit("Server_getClient-offline", data)
            }
        })

        // const userOffline = await getData_Byid(UsersConnects, iduser[0])
        // console.log(userOffline.data().id)
        // io.sockets.emit("Server_getClient-offline", userOffline.id)
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
        const idSocket = await findUser_Online(UsersConnects, data.idFind)


        if (idSocket != "user offline") {
            const userRealtime = await User.doc(data.idFind).get()
            console.log("send data to update")
            io.to(idSocket).emit("Server-send-Rendermess", userRealtime.data().Message)
        }
    })

    // Socket on aprove friend message
    socket.on("aprove_friend", async (data) => {
        try {
            console.log(data)
            // lay du lieu user
            const dataUser = await getData_Byid(User, data.idUser)
            // lay danh sach Message
            const TempArray = dataUser.Message
            // Thay doi mang
            const TempArray_Update = TempArray.map(item => {
                if (item.type == "add friend" && item.data.idAdd == data.idUserAdd) {
                    item.state = "da xem"
                    return item
                } else {
                    return item
                }
            })
            // Cap nhat lai mang
            const upDateUser = await User.doc(data.idUser).update({
                Message: TempArray_Update
            })
            addFriend_Byid(User, data.idUserAdd, data.idUser)
            //  thong bao cho user cap nhat lai Message ==> thay doi state va set coutMess
            socket.emit("Server-send-Rendermess", TempArray_Update)

            //  thong bao cho user duoc chap nhan cap nhat lai Message ==> thay doi state va set coutMess
            const idSocket = await findUser_Online(UsersConnects, data.idUserAdd)
            User.doc(data.idUserAdd).update({
                Message: FielValue.arrayUnion({
                    type: "thong bao",
                    state: "chua xem",
                    data: `${dataUser.displayName} đã chấp nhận lời mời kết bạn (:`
                })
            })
            if (idSocket != "user offline") {


                const userRealtime = await User.doc(data.idUserAdd).get()
                console.log("send data to update chap nhan ket ban")

                io.to(idSocket).emit("Server-send-Rendermess", userRealtime.data().Message)

            }

        } catch (err) {
            console.log("Loi socket aprove friend >>> ", err)
        }

    })

    // Socket on seen_mess thay doi trang thai da xem

    socket.on("seen_mess", async (data) => {
        console.log(data)
        const dataUser = await getData_Byid(User, data.idUser)
        // lay danh sach Message
        const TempArray = dataUser.Message
        // Thay doi mang
        const TempArray_Update = TempArray.map(item => {
            if (item.type == "thong bao" && item.data == data.content) {
                item.state = "da xem"
                return item
            } else {
                return item
            }
        })
        // Cap nhat lai mang
        const upDateUser = await User.doc(data.idUser).update({
            Message: TempArray_Update
        })
        socket.emit("Server-send-Rendermess", TempArray_Update)

    })

    // Up date avatar
    socket.on("Client_updateAvatar", async (data) => {
        const updateUser = User.doc(data.id).update({
            avatar: data.url
        })
        socket.emit("Server_updateAvatar", data.url)
    })

    // get friends online
    socket.on("Client_getFriend-online", async (data) => {

        const rs = await getListIdUserOnline(UsersConnects, data)
        socket.emit("Server_getFriend-online", rs)
    })

})




module.exports = server