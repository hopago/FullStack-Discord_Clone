import express from 'express';
import { Server } from 'socket.io';

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
    socket.emit(undefined, (user) => {
        console.log(`${user.userName}#${user.tag} connected...`);
        socket.emit(undefined, socket.id);
    });

    socket.on("activateUser", (user) => {
        console.log(user);
        const { friends, ...currentUser } = user;

        activateUser(currentUser, friends, socket.id);
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

        io.to(receiver.socketId).emit("getNotification", {
            senderId,
            requestType
        });
    });

    socket.on("getOnlineFriends", (_id) => {
        const receiver = findUserById(_id);
        const onlineFriends = getOnlineFriends(_id);

        io.to(receiver.socketId).emit("sendOnlineFriends", onlineFriends);
    });

    socket.on("disconnect", (_id) => {
        disconnectUser(_id);
    });
});

function activateUser(user, friends, socketId) {
    const activateUser = {
        ...user,
        friendsInfoArray: friends,
        socketId
    };

    !UsersState.users.some((user) => user._id === activateUser._id) &&
      UsersState.users.push(activateUser);
}

function disconnectUser(_id) {
    UsersState.users.filter((user) => user._id !== _id);
}

function findUserById(_id) {
    return UsersState.users.find((user) => user._id === user._id);
}

function getOnlineFriends(_id) {
    const currentUser = UsersState.users.find(user => user._id === _id);
    const friends = currentUser.friendsInfoArray;
    return UsersState.users.filter(user => friends.filter(friend => friend._id === user._id ));
}