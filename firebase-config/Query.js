var FielValue = require("firebase-admin").firestore.FieldValue;


const getData_Byid = async (colection, id) => {
    const doc = await colection.doc(id).get()

    return doc.data()
}

const addFriend_Byid = async (colection, idUserAdd, idUser) => {

    // Cap nhat danh sach ban be
    const upDateUser1 = await colection.doc(idUser).update({
        friends: FielValue.arrayUnion(idUserAdd)
    })
    // Cap nhat danh sach ban be nguoi add
    const upDateUser2 = await colection.doc(idUserAdd).update({
        friends: FielValue.arrayUnion(idUser)
    })
}

const findUser_Online = async (colection, idUser) => {
    const data = await colection.where("id", "==", idUser).get()
    const isUser = data.docs.map(doc => doc.id)
    if (isUser[0]) {
        const doc = await colection.doc(isUser[0]).get()
        const socketId = doc.data().idSocket
        return socketId

    } else {
        return "user offline"

    }
}

const getListIdUserOnline = async (colection, listUser) => {
    const listFriend = [];

    const listUserOnline = await colection.get()

    listUserOnline.forEach(doc => {

        if (listUser.includes(doc.data().id)) {
            listFriend.push(doc.data().id)
        }
    });
    return listFriend
}

const createChatRoms = (colection, idUser1, idUser2) => {
    var date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()} - ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    const data = {
        state: "P2P",
        member: [idUser2, idUser1],
        data: [
            {
                type: "start",
                content: "Hai người đã trở thành bạn bè hãy gửi lời chào hỏi nhau nhé !"
            }

        ]
    }
    colection.add(data)
}
const getDataRoomChat = async (colection, idUser1, idUser2, option) => {
    const snapshot = await colection.get()
    let idroom = "";
    let dataChat = [];
    const docs = snapshot.forEach(doc => {
        const data = doc.data();
        if (data.state == "P2P" && data.member.includes(idUser1) && data.member.includes(idUser2)) {
            idroom = doc.id
            dataChat = [...data.data]
        }
    })

    console.log("id room >> ", idroom)
    console.log("data chat >> ", dataChat)



    if (option == "id") {
        return idroom
    }
    if (option == "dataChat") {
        return dataChat
    }
    return {
        data: dataChat[0].data,
        idRoom: idRoom[0]
    }

    return "0"
}


module.exports = {
    getData_Byid,
    addFriend_Byid,
    findUser_Online,
    getListIdUserOnline,
    createChatRoms,
    getDataRoomChat
}