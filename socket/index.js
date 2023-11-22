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
    setUsers: function (newUsersArray) {
        this.users = newUsersArray;
    },
};

io.on('connection', socket => {
    console.log(`User ${socket.id.substring(0, 5)} connected...`);

    socket.on("activateUser", (user) => {
        const { friends, ...currentUser } = user;

        activateUser(currentUser, friends, socket.id);
    });

    socket.on("getOnlineFriends", (_id) => {
        const currentUser = findUserById(_id);
        const onlineFriends = getOnlineFriends(_id);

        if (currentUser) {
            io.to(currentUser).emit('onlineFriendList', onlineFriends);
        } else {
            console.log("Something went wrong in getOnlineFriends...");
        }
    });

    socket.on('sendNotification', ({ senderId, receiverId, type }) => {
        const receiver = findUserById(receiverId);

        io.to(receiver._id).emit("getNotification", {
            senderId,
            type
        });
    });

    socket.on("onlineFriends", (_id) => {
        const onlineFriends = getOnlineFriends(_id);

    });
});

function activateUser(user, friends, socketId) {
    const activateUser = {
        ...user,
        friendsInfoArray: friends
    };

    !UsersState.users.some((user) => user._id === activateUser._id) &&
      UsersState.setUsers([
        ...UsersState.users.push({ ...activateUser, socketId })
      ]);
}

function disconnectUser(_id) {
    UsersState.setUsers(
        UsersState.users.filter((user) => user._id !== _id)
    );
}

function findUserById(_id) {
    return UsersState.users.find((user) => user._id === user._id);
}

function getOnlineFriends(_id) {
    const currentUser = UsersState.users.find(user => user._id === _id);
    const friends = currentUser.friendsInfoArray;
    return UsersState.users.filter(user => friends.filter(friend => friend._id === user._id ));
}