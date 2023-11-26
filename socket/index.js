import express from 'express';
import { Server } from 'socket.io';

{/* TODO: prevent refresh disconnect */}

const PORT = process.env.PORT || 5000;
const ADMIN = "Admin";

const app = express();

const expressServer = app.listen(PORT, () => {
    console.log(`Socket listening on port: ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8000"]
    }
});

const UsersState = {
    users: [],
};

io.on('connection', socket => {
    socket.on("activateUser", (user) => {
        const { friends, ...currentUser } = user;

        activateUser(currentUser, friends, socket.id);

        console.log(`${user.userName}#${user.tag} connected...`);
    });

    socket.on("getOnlineFriends", (_id) => {
        const currentUser = findUserById(_id);
        const onlineFriends = getOnlineFriends(_id);

        if (currentUser) {
            io.to(currentUser.socketId).emit('onlineFriendList', onlineFriends);
        } else {
            console.log("Something went wrong in getOnlineFriends...");
        }
    });

    socket.on('sendNotification', ({ senderId, receiverId, requestType }) => {
        const receiver = findUserById(receiverId);
        if (!receiver) {
            console.log(`Type: ${requestType}, Receiver has not found...`);
            return socket.emit("userNotFound", {
                message: "Receiver not found...",
                status: 400
            });
        } else {
            io.to(receiver.socketId).emit("getNotification", {
                senderId,
                requestType
            });
        }
    });

    socket.on("getOnlineFriends", (_id) => {
        const receiver = findUserById(_id);
        const onlineFriends = getOnlineFriends(_id);

        io.to(receiver.socketId).emit("sendOnlineFriends", onlineFriends);
    });

    socket.on("logout", (_id) => {
        const user = findUserById(_id);
        if (user) {
            console.log(`${user.userName}#${user.tag} has been disconnected...`);
            disconnectUser(_id);
        } else {
            console.log(`${user.userName}#${user.tag} has not found...`);
        }
    });
});

function activateUser(user, friends, socketId) {
    const activateUser = {
        ...user,
        friendsInfoArray: friends,
        socketId
    };

    console.log(activateUser);

    !UsersState.users.some((user) => user._id === activateUser._id) &&
      UsersState.users.push(activateUser);
}

function disconnectUser(_id) {
    UsersState.users = UsersState.users.filter((user) => user._id !== _id);
}

function findUserById(_id) {
    return UsersState.users.find((user) => user._id === _id);
}

function getOnlineFriends(_id) {
    console.log(UsersState.users);
    const currentUser = UsersState.users.find(user => user._id === _id);
    if (!currentUser) {
        console.log(`${currentUser.userName}#${currentUser.tag} has not found...`);
        return;
    }
    const friends = currentUser.friendsInfoArray;
    if (Array.isArray(friends) && !friends.length) {
        console.log(`${currentUser.userName}#${currentUser.tag} has no friend...`);
        return;
    }
    return UsersState.users.filter(user => friends.filter(friend => friend._id === user._id ));
}